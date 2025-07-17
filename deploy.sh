#!/bin/bash
set -eo pipefail

# Azure Docker Building and Pushing Script
# Usage: ./azure_build_and_push.sh [environment]

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 [environment]"
  echo "Valid environments are: dev, staging, prod"
  exit 1
fi

PROJECT_NAME="wholepal"
ENVIRONMENT="$1"
RESOURCE_GROUP="rg-dev-uksouth-container-registry"
LOCATION="uksouth"
ACR_NAME="acrdevuksouthwholepal001"
SUBSCRIPTION_ID="19eaf6b6-6bdd-497b-bcfa-c588073fb588"
NEXT_PUBLIC_API_URL="https://api-platform.wholepal.com"
NEXT_PUBLIC_APP_URL="https://platform.wholepal.com"

# Containers names
CONTAINERS=("web-application-frontend")

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo "Invalid environment specified: $ENVIRONMENT"
  echo "Valid environments are: dev, staging, prod"
  exit 1
fi

# Get Git tag for versioning
IMAGE_TAG="$(git describe --tags "$(git rev-list --tags --max-count=1)" 2>/dev/null || echo "latest")"
echo "Using image tag: ${IMAGE_TAG}"

# Login to Azure (if not already authenticated)
echo "Checking Azure authentication..."
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Not logged into Azure. Please run 'az login' first."
    exit 1
fi

# Set the subscription
echo "Setting subscription to ${SUBSCRIPTION_ID}..."
if ! az account set --subscription "${SUBSCRIPTION_ID}"; then
    echo "Failed to set Azure subscription to ${SUBSCRIPTION_ID}, exiting."
    exit 1
fi

# Authenticate Docker with Azure Container Registry
echo "Logging into Azure Container Registry: ${ACR_NAME}..."
if ! az acr login --name "${ACR_NAME}"; then
    echo "Failed to log into Azure Container Registry ${ACR_NAME}, exiting."
    exit 1
fi

# Function to build Docker image
build_image() {
    local container_name=$1
    local dockerfile_path="./Dockerfile"
    local context_path="."

    local full_image_name="${ACR_NAME}.azurecr.io/${PROJECT_NAME}/${container_name}:${IMAGE_TAG}"
    local latest_image_name="${ACR_NAME}.azurecr.io/${PROJECT_NAME}/${container_name}:latest"
    local env_image_name="${ACR_NAME}.azurecr.io/${PROJECT_NAME}/${container_name}:${ENVIRONMENT}"

    echo "Building ${container_name} with tag ${IMAGE_TAG}..."

    # Build the Docker image
    if [ -f "${dockerfile_path}" ]; then
        echo "Building from Dockerfile at ${dockerfile_path}..."
        if ! docker build --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" -t "${full_image_name}" -t "${latest_image_name}" -t "${env_image_name}" -f "${dockerfile_path}" "${context_path}"; then
            echo "Docker build failed for ${container_name}, exiting."
            exit 1
        fi
    else
        echo "Dockerfile not found at ${dockerfile_path}. Exiting..."
        exit 1
    fi

    echo "Successfully built ${container_name} image"
}

# Function to push container
push_image() {
    local container_name=$1
    local full_image_name="${ACR_NAME}.azurecr.io/${PROJECT_NAME}/${container_name}:${IMAGE_TAG}"
    local latest_image_name="${ACR_NAME}.azurecr.io/${PROJECT_NAME}/${container_name}:latest"
    local env_image_name="${ACR_NAME}.azurecr.io/${PROJECT_NAME}/${container_name}:${ENVIRONMENT}"

    echo "Pushing Docker images for ${container_name}..."

    if ! docker push "${full_image_name}"; then
        echo "Failed to push Docker image ${full_image_name}"
        exit 1
    fi

    if ! docker push "${latest_image_name}"; then
        echo "Failed to push Docker image ${latest_image_name}"
        exit 1
    fi

    if ! docker push "${env_image_name}"; then
        echo "Failed to push Docker image ${env_image_name}"
        exit 1
    fi

    echo "Successfully pushed ${container_name} images"
}

## Create resource group if it doesn't exist
echo "Creating resource group ${RESOURCE_GROUP} in ${LOCATION}..."
az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}" --output table

# Main execution
echo "Starting build and push process for environment: ${ENVIRONMENT}"
echo "Project: ${PROJECT_NAME}"
echo "ACR: ${ACR_NAME}"
echo "Image tag: ${IMAGE_TAG}"
echo "----------------------------------------"

# Build and push each container
for container in "${CONTAINERS[@]}"; do
    echo "Processing container: ${container}"

    # Build the container
    build_image "${container}"

    # Push the container
    push_image "${container}"


    echo "----------------------------------------"
done

echo "All containers successfully built and pushed!"
