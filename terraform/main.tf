# Création du Namespace
resource "kubernetes_namespace" "app_namespace" {
  metadata {
    name = var.namespace_name
    labels = {
      app = "gestionstock"
    }
  }
}

# Création du Secret pour MySQL
resource "kubernetes_secret" "mysql_secret" {
  metadata {
    name      = "mysql-secret"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  data = {
    "root-password" = var.mysql_root_password
    "database-name" = var.mysql_database
  }

  type = "Opaque"
}

# Persistent Volume Claim pour MySQL
resource "kubernetes_persistent_volume_claim" "mysql_pvc" {
  metadata {
    name      = "mysql-pvc"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}
