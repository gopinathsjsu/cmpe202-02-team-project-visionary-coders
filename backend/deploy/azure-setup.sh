#!/bin/bash

set -e

# Azure Setup Script for FastAPI Backend
# Usage: bash azure-setup.sh <RESOURCE_GROUP_NAME> <LOCATION>

RESOURCE_GROUP=${1:-"FastAPI-RG"}
LOCATION=${2:-"eastus"}
VM_SIZE="Standard_B1s"
ADMIN_USERNAME="azureuser"
IMAGE="Ubuntu2204"

echo "Creating Resource Group: $RESOURCE_GROUP in $LOCATION..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "Creating Network Resources..."
az network vnet create \
  --resource-group $RESOURCE_GROUP \
  --name myVNet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefix 10.0.1.0/24

az network public-ip create \
  --resource-group $RESOURCE_GROUP \
  --name myPublicIP \
  --sku Standard

az network lb create \
  --resource-group $RESOURCE_GROUP \
  --name myLoadBalancer \
  --sku Standard \
  --public-ip-address myPublicIP \
  --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool

az network lb probe create \
  --resource-group $RESOURCE_GROUP \
  --lb-name myLoadBalancer \
  --name myHealthProbe \
  --protocol tcp \
  --port 80

az network lb rule create \
  --resource-group $RESOURCE_GROUP \
  --lb-name myLoadBalancer \
  --name myLoadBalancerRule \
  --protocol tcp \
  --frontend-port 80 \
  --backend-port 80 \
  --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool \
  --probe-name myHealthProbe

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
  --access Allow

az network nsg rule create \
  --resource-group $RESOURCE_GROUP \
  --nsg-name myNSG \
  --name AllowSSH \
  --priority 101 \
  --destination-port-ranges 22 \
  --protocol Tcp \
  --access Allow

echo "Creating Network Interfaces (NICs) and VMs..."
# Create 2 VMs using Explicit NIC creation
for i in 1 2; do
  NIC_NAME="myVM${i}-Nic"
  
  echo "Creating NIC for VM $i connected to Load Balancer..."
  az network nic create \
    --resource-group $RESOURCE_GROUP \
    --name $NIC_NAME \
    --vnet-name myVNet \
    --subnet mySubnet \
    --network-security-group myNSG \
    --lb-name myLoadBalancer \
    --lb-address-pools myBackEndPool

  echo "Creating VM $i using $NIC_NAME..."
  az vm create \
    --resource-group $RESOURCE_GROUP \
    --name myVM$i \
    --image $IMAGE \
    --size $VM_SIZE \
    --admin-username $ADMIN_USERNAME \
    --generate-ssh-keys \
    --nics $NIC_NAME \
    --custom-data cloud-init.yaml
done

echo "Deployment Script Finished!"
echo "Public IP:"
az network public-ip show --resource-group $RESOURCE_GROUP --name myPublicIP --query ipAddress --output tsv