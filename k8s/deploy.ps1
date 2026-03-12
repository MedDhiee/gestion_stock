# =============================================================
#  deploy.ps1 — Déploiement complet sur Minikube
#  Usage : .\k8s\deploy.ps1
# =============================================================

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Split-Path -Parent $ROOT)   # racine du projet

Write-Host "==> Démarrage de Minikube..." -ForegroundColor Cyan
minikube start --driver=docker

# Pointer Docker vers le daemon interne de Minikube
Write-Host "==> Configuration de l'environnement Docker de Minikube..." -ForegroundColor Cyan
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# ------------------------------------------------------------------
# Build des images dans le docker de Minikube (imagePullPolicy: Never)
# ------------------------------------------------------------------
Write-Host "==> Build de l'image backend..." -ForegroundColor Cyan
# Contexte = gestiondestock/ (contient pom.xml et src/) ; Dockerfile dans Docker/backend/
docker build -t gestiondestock-backend -f ./Docker/backend/Dockerfile ./gestiondestock

Write-Host "==> Build de l'image frontend..." -ForegroundColor Cyan
# Contexte = gestion_stock_ui/hb_electronics/ (contient package.json, src/, nginx.conf)
docker build -t gestiondestock-frontend -f ./Docker/frontend/Dockerfile ./gestion_stock_ui/hb_electronics

# ------------------------------------------------------------------
# Déploiement des manifests Kubernetes
# ------------------------------------------------------------------
Write-Host "==> Création du Namespace..." -ForegroundColor Cyan
kubectl apply -f k8s/namespace.yml

Write-Host "==> Déploiement MySQL..." -ForegroundColor Cyan
kubectl apply -f k8s/mysql/secret.yml
kubectl apply -f k8s/mysql/pvc.yml
kubectl apply -f k8s/mysql/deployment.yml
kubectl apply -f k8s/mysql/service.yml

Write-Host "==> Attente que MySQL soit prêt..." -ForegroundColor Yellow
kubectl rollout status deployment/mysql -n gestionstock --timeout=120s

Write-Host "==> Déploiement Backend..." -ForegroundColor Cyan
kubectl apply -f k8s/backend/deployment.yml
kubectl apply -f k8s/backend/service.yml

Write-Host "==> Déploiement Frontend..." -ForegroundColor Cyan
kubectl apply -f k8s/frontend/deployment.yml
kubectl apply -f k8s/frontend/service.yml

Write-Host "==> Déploiement Prometheus..." -ForegroundColor Cyan
kubectl apply -f k8s/prometheus/configmap.yml
kubectl apply -f k8s/prometheus/deployment.yml
kubectl apply -f k8s/prometheus/service.yml

Write-Host "==> Déploiement Grafana..." -ForegroundColor Cyan
kubectl apply -f k8s/grafana/pvc.yml
kubectl apply -f k8s/grafana/deployment.yml
kubectl apply -f k8s/grafana/service.yml

# ------------------------------------------------------------------
# Résumé des URLs d'accès
# ------------------------------------------------------------------
Write-Host ""
Write-Host "==> Tous les services sont déployés !" -ForegroundColor Green
Write-Host ""
Write-Host "URLs d'accès (via minikube service) :" -ForegroundColor Yellow

$MINIKUBE_IP = minikube ip
Write-Host "  Frontend    : http://${MINIKUBE_IP}:30080"
Write-Host "  Backend API : http://${MINIKUBE_IP}:30081"
Write-Host "  Prometheus  : http://${MINIKUBE_IP}:30090"
Write-Host "  Grafana     : http://${MINIKUBE_IP}:30300  (admin/admin)"
Write-Host ""
Write-Host "Ou utilisez : minikube service gestiondestock-ui -n gestionstock" -ForegroundColor DarkGray
