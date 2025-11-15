# Docker and Kubernetes

## Road to k8s
- Create Docker Images
- Push image to Registry publicly or privately
- Create Namespace `kubectl create namespace testing`
- Set up CNAME in DNS with k8s address as destination
- Set up SSL certificate `kubectl apply -f k8s/ssl.yml -n testing`
- If using ACR, set up the ACR credential
  ``` bash
  kubectl create secret docker-registry acr-secret \
    --docker-server=<your-acr-name>.azurecr.io \
    --docker-username=<service-principal-id> \
    --docker-password=<service-principal-password> \
    --docker-email=<your-email@example.com> \
    -n testing
  ```
- Apply yml to k8s
  ``` bash
  kubectl apply -f k8s/dotnet-mongodb.yaml -n testing
  kubectl apply -f k8s/dotnet-mongodb-acr.yaml -n testing
  ```

## Docker Compose
``` bash
# Create container for all services
docker compose up --build

# Create container based on the DockeFile
docker compose -f docker-compose.yml up --build
docker compose -f docker-compose.mongodb.yml up --build
docker compose -f docker-compose.mysql.yml up --build

# Force Recreate
docker compose -f docker-compose.mongodb.yml up -d --build --force-recreate
```

## Dockerfile Build
``` bash
# Create container for single service
cd .\dotnet-inmemorydb\
# Create Image
docker build -t dotnet-inmemorydb:latest .
# Run the Container
docker run -d --name dotnet-inmemorydb -p 8888:8888 -e ASPNETCORE_ENVIRONMENT=Production dotnet-inmemorydb:latest
```

## Push Image to Docker Hub (Public)
``` bash
# Push the image into Docker Hub
# Login
docker login
# Build Image
docker build -t <Your Username>/dotnet-inmemorydb:v1 -t <Your Username>/dotnet-inmemorydb:latest .\
docker build -t luoxisteven/dotnet-inmemorydb:latest .

# Push Images
docker push <Your Username>/dotnet-inmemorydb:v1
docker push luoxisteven/dotnet-inmemorydb:latest

docker build -t luoxisteven/dotnet-mongodb:v2 .
docker push luoxisteven/dotnet-mongodb:v2
```

## Push Image to Lightsail Container Service
``` bash
# Push Image to the Lightsail container service
aws lightsail push-container-image --region <Region> --service-name <ContainerServiceName> --label <ContainerImageLabel> --image <LocalContainerImageName>:<ImageTag>

# For exmple
aws lightsail push-container-image --region ap-southeast-2 --service-name testing --label dotnet-inmemorydb --image luoxisteven/dotnet-inmemorydb:latest
```

## Setting up Custom Domain for Container (Try Amazon API Gateway and SSL):
1) Create a SSL/TLS Certificate
2) Setting up a CNAME record for the SSL/TLS Certificate
3) Setting up another CNAME record for your domain and the default domain

## Push image to Azure Container Registry (ACR)
``` bash
# Beware of the node architect whether it is ARM64 or x86
# Build the image first
az login
az acr login --name itmacr # Open the Docker Desktop first before running this
docker tag react-task:latest itmacr.azurecr.io/react-task:latest
docker push itmacr.azurecr.io/react-task:latest

docker tag dotnet-mongodb:latest itmacr.azurecr.io/dotnet-mongodb:latest
docker push itmacr.azurecr.io/dotnet-mongodb:latest
```

## Apply acr images to k8s
``` bash
# Apply acr images to k8s
kubectl config use-context k8s-itm-01
kubectl apply -f k8s/dotnet-mongodb-acr.yaml -n testing

# Delete
kubectl -n testing delete -f k8s/dotnet-mongodb-acr.yaml
```

## Apply local images to k8s
``` bash
# Use Context
kubectl config use-context k8s-itm-01
# Apply yaml to k8s
kubectl apply -f k8s/ssl.yml -n testing # add a ssl.yml credentails
kubectl apply -f k8s/ingress.yml -n testing
kubectl apply -f k8s/dotnet-mongodb.yaml -n testing

# Delete yaml file from namespace
kubectl -n testing delete -f k8s/dotnet-mongodb.yaml
```

## Kubernetes Namespace
``` bash
kubectl create namespace testing
kubectl delete namespace testing
```

## Use my own k8s
``` bash
# Image preparation
docker compose -f docker-compose.mongodb.arm64.yml up --build
docker tag dotnet-mongodb:arm64 luoxisteven/dotnet-mongodb:arm64-latest
docker push luoxisteven/dotnet-mongodb:arm64-latest
docker tag react-task:arm64 luoxisteven/react-task:arm64-latest
docker push luoxisteven/react-task:arm64-latest

# AKS Prepartion
# First Create a AKS in Azure Platform
az login
az aks get-credentials --resource-group crud.xiluo.net --name crud-xi-luo

kubectl config use-context crud-xi-luo
kubectl create namespace s-testing

# Set up SSL
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.14.0/deploy/static/provider/cloud/deploy.yaml
# Wait for the External IP and Not Pending
kubectl -n ingress-nginx get svc ingress-nginx-controller
# Set an A Record pointing to External-IP: aks -> 4.237.106.143
# Set two CNAME Record pointing to the A record: crud2 -> aks.xiluo.net, crudapi -> aks.xiluo.net
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
# Wait and Ready
kubectl apply -f k8s/cluster-issuer.yaml
# Check for the image and the Architecture of the Nodes
# Make sure the Architecture of the Nodes align with your Images
kubectl apply -f k8s/dotnet-mongodb.yaml -n s-testing

kubectl apply -f k8s/my-ingress.yml -n s-testing
```
