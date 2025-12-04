#!/bin/bash

# Stop script on error
set -e

# ==============================================================================
# CONFIGURATION
# ==============================================================================
RESOURCE_GROUP=${1:-"FastAPI-RG"}
LOCATION=${2:-"westus"}
VM_SIZE="Standard_B1s"
ADMIN_USERNAME="azureuser"
IMAGE="Ubuntu2204"

# Database Config
# FIX FOR MAC OS: Use 'tr' to convert RG name to lowercase
RG_LOWER=$(echo "$RESOURCE_GROUP" | tr '[:upper:]' '[:lower:]')
DB_SERVER_NAME="fastapi-db-${RG_LOWER}"
DB_USERNAME="dbadmin"
DB_PASSWORD="YourStrongPassword123!" # <--- CHANGE THIS FOR PRODUCTION
DB_NAME="fastapidb"

# ==============================================================================
# INFRASTRUCTURE SETUP
# ==============================================================================

echo "----------------------------------------------------------------"
echo "Starting Deployment for Resource Group: $RESOURCE_GROUP"
echo "----------------------------------------------------------------"

# 1. Resource Group
if [ $(az group exists --name $RESOURCE_GROUP) = "false" ]; then
    echo "Creating Resource Group..."
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo "Resource Group $RESOURCE_GROUP already exists. Skipping."
fi

# 2. Network Resources
echo "--- Networking ---"

# VNet
if ! az network vnet show --resource-group $RESOURCE_GROUP --name myVNet &>/dev/null; then
    echo "Creating VNet..."
    az network vnet create \
      --resource-group $RESOURCE_GROUP \
      --name myVNet \
      --address-prefix 10.0.0.0/16 \
      --subnet-name mySubnet \
      --subnet-prefix 10.0.1.0/24
else
    echo "VNet myVNet already exists. Skipping."
fi

# Public IP
if ! az network public-ip show --resource-group $RESOURCE_GROUP --name myPublicIP &>/dev/null; then
    echo "Creating Public IP..."
    az network public-ip create \
      --resource-group $RESOURCE_GROUP \
      --name myPublicIP \
      --sku Standard
else
    echo "Public IP myPublicIP already exists. Skipping."
fi

# Load Balancer
if ! az network lb show --resource-group $RESOURCE_GROUP --name myLoadBalancer &>/dev/null; then
    echo "Creating Load Balancer..."
    az network lb create \
      --resource-group $RESOURCE_GROUP \
      --name myLoadBalancer \
      --sku Standard \
      --public-ip-address myPublicIP \
      --frontend-ip-name myFrontEnd \
      --backend-pool-name myBackEndPool
else
    echo "Load Balancer myLoadBalancer already exists. Skipping."
fi

# LB Probe
echo "Updating Load Balancer Rules/Probes..."
az network lb probe create \
  --resource-group $RESOURCE_GROUP \
  --lb-name myLoadBalancer \
  --name myHealthProbe \
  --protocol tcp \
  --port 80 > /dev/null

az network lb rule create \
  --resource-group $RESOURCE_GROUP \
  --lb-name myLoadBalancer \
  --name myLoadBalancerRule \
  --protocol tcp \
  --frontend-port 80 \
  --backend-port 80 \
  --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool \
  --probe-name myHealthProbe > /dev/null

# Network Security Group
if ! az network nsg show --resource-group $RESOURCE_GROUP --name myNSG &>/dev/null; then
    echo "Creating Network Security Group..."
    az network nsg create \
      --resource-group $RESOURCE_GROUP \
      --name myNSG
      
    az network nsg rule create \
      --resource-group $RESOURCE_GROUP \
      --nsg-name myNSG \
      --name AllowHTTP \
      --priority 100 \
      --destination-port-ranges 80 \
      --protocol Tcp \
      --access Allow > /dev/null

    az network nsg rule create \
      --resource-group $RESOURCE_GROUP \
      --nsg-name myNSG \
      --name AllowSSH \
      --priority 101 \
      --destination-port-ranges 22 \
      --protocol Tcp \
      --access Allow > /dev/null
else
    echo "NSG myNSG already exists. Skipping."
fi

# 3. Database (PostgreSQL)
echo "--- Database Server ---"
# Check if DB Server exists
if ! az postgres flexible-server show --resource-group $RESOURCE_GROUP --name $DB_SERVER_NAME &>/dev/null; then
    echo "Creating Azure PostgreSQL Flexible Server ($DB_SERVER_NAME)..."
    echo "NOTE: This step takes 5-10 minutes. Please wait."
    
    # REMOVED --database-name from here
    az postgres flexible-server create \
      --resource-group $RESOURCE_GROUP \
      --name $DB_SERVER_NAME \
      --location $LOCATION \
      --admin-user $DB_USERNAME \
      --admin-password $DB_PASSWORD \
      --sku-name Standard_B1ms \
      --tier Burstable \
      --version 13 \
      --storage-size 32 \
      --yes
      
    echo "Configuring DB Firewall to allow Azure Services..."
    az postgres flexible-server firewall-rule create \
      --resource-group $RESOURCE_GROUP \
      --name $DB_SERVER_NAME \
      --rule-name AllowAllAzureServices \
      --start-ip-address 0.0.0.0 \
      --end-ip-address 0.0.0.0 > /dev/null
else
    echo "Database Server $DB_SERVER_NAME already exists. Skipping."
fi

# 3b. Create the Specific Database inside the Server
echo "--- Database (Specific DB) ---"
if ! az postgres flexible-server db show --resource-group $RESOURCE_GROUP --server-name $DB_SERVER_NAME --database-name $DB_NAME &>/dev/null; then
    echo "Creating Database '$DB_NAME' inside server..."
    az postgres flexible-server db create \
      --resource-group $RESOURCE_GROUP \
      --server-name $DB_SERVER_NAME \
      --database-name $DB_NAME > /dev/null
else
    echo "Database '$DB_NAME' already exists. Skipping."
fi

# 4. Compute (VMs)
echo "--- Virtual Machines ---"

for i in 1 2; do
  NIC_NAME="myVM${i}-Nic"
  VM_NAME="myVM${i}"
  
  # Check NIC
  if ! az network nic show --resource-group $RESOURCE_GROUP --name $NIC_NAME &>/dev/null; then
      echo "Creating NIC for $VM_NAME connected to Load Balancer..."
      az network nic create \
        --resource-group $RESOURCE_GROUP \
        --name $NIC_NAME \
        --vnet-name myVNet \
        --subnet mySubnet \
        --network-security-group myNSG \
        --lb-name myLoadBalancer \
        --lb-address-pools myBackEndPool > /dev/null
  else
      echo "NIC $NIC_NAME already exists. Skipping."
  fi

  # Check VM
  if ! az vm show --resource-group $RESOURCE_GROUP --name $VM_NAME &>/dev/null; then
      echo "Creating $VM_NAME using $NIC_NAME..."
      az vm create \
        --resource-group $RESOURCE_GROUP \
        --name $VM_NAME \
        --image $IMAGE \
        --size $VM_SIZE \
        --admin-username $ADMIN_USERNAME \
        --generate-ssh-keys \
        --nics $NIC_NAME \
        --custom-data cloud-init.yaml > /dev/null
  else
      echo "VM $VM_NAME already exists. Skipping."
  fi
done

echo "----------------------------------------------------------------"
echo "Deployment Finished Successfully!"
echo "----------------------------------------------------------------"
PUBLIC_IP=$(az network public-ip show --resource-group $RESOURCE_GROUP --name myPublicIP --query ipAddress --output tsv)
echo "Public IP: http://$PUBLIC_IP/docs"
echo "Database Host: $DB_SERVER_NAME.postgres.database.azure.com"
echo "Database User: $DB_USERNAME"
echo "Database Name: $DB_NAME"