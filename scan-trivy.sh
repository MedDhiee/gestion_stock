#!/bin/bash

# === Configuration ===
IMAGE_NAME="gestiondestock-backend"  # <-- Mets ici le nom correct de ton image Docker
REPORT_DIR="./trivy-reports"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# === Préparation ===
mkdir -p "$REPORT_DIR"

echo "🚀 Lancement du scan Trivy sur l'image: $IMAGE_NAME"
echo "📝 Les rapports seront enregistrés dans: $REPORT_DIR"

# === 1. Scan en format lisible (table) ===
docker run --rm -e TRIVY_TIMEOUT=20m -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image "$IMAGE_NAME" > "$REPORT_DIR/report-$TIMESTAMP.txt"

# === 2. Scan en format HTML (template) ===
docker run --rm -e TRIVY_TIMEOUT=20m -v /var/run/docker.sock:/var/run/docker.sock -v "$(pwd)/$REPORT_DIR:/root" aquasec/trivy image --format template --template "@contrib/html.tpl" -o "/root/report-$TIMESTAMP.html" "$IMAGE_NAME"

echo "✅ Scan terminé !"
echo "📄 Fichiers générés :"
ls -l "$REPORT_DIR"
