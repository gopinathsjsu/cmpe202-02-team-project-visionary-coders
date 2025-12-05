#!/bin/bash

# Exit on error
set -e

# Configuration
RESOURCE_GROUP="campus-marketplace-rg"
LOCATION="eastus"
ACR_NAME="campusmarketplaceacr$RANDOM" # Unique name
APP_PLAN_NAME="campus-marketplace-plan"
WEB_APP_NAME="campus-marketplace-frontend-$RANDOM" # Unique name
IMAGE_NAME="frontend"
TAG="latest"

echo "Starting deployment..."

# 1. Create Resource Group
echo "Creating Resource Group: $RESOURCE_GROUP..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create Azure Container Registry (ACR)
echo "Creating ACR: $ACR_NAME..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# 3. Login to ACR
echo "Logging into ACR..."
az acr login --name $ACR_NAME

# 4. Build and Push Docker Image
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "loginServer" --output tsv)
FULL_IMAGE_NAME="$ACR_LOGIN_SERVER/$IMAGE_NAME:$TAG"

echo "Building Docker image: $FULL_IMAGE_NAME..."
docker build -t $FULL_IMAGE_NAME .

echo "Pushing Docker image to ACR..."
docker push $FULL_IMAGE_NAME

# 5. Create App Service Plan
echo "Creating App Service Plan: $APP_PLAN_NAME..."
az appservice plan create --name $APP_PLAN_NAME --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# 6. Create Web App for Containers
echo "Creating Web App: $WEB_APP_NAME..."
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "passwords[0].value" --output tsv)

az webapp create --resource-group $RESOURCE_GROUP --plan $APP_PLAN_NAME --name $WEB_APP_NAME \
    --deployment-container-image-name $FULL_IMAGE_NAME \
    --docker-registry-server-url "https://$ACR_LOGIN_SERVER" \
    --docker-registry-server-user $ACR_USERNAME \
    --docker-registry-server-password $ACR_PASSWORD

# 7. Configure Web App
echo "Configuring Web App..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --settings WEBSITES_PORT=3000

echo "Deployment completed successfully!"
echo "Your app is available at: http://$WEB_APP_NAME.azurewebsites.net"
