resource "kubernetes_config_map" "alertmanager_config" {
  metadata {
    name      = "alertmanager-config"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  data = {
    "config.yml" = file("${path.module}/alertmanager/config.yml")
  }
}

resource "kubernetes_deployment" "alertmanager" {
  metadata {
    name      = "alertmanager"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
    labels = {
      app = "alertmanager"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "alertmanager"
      }
    }

    template {
      metadata {
        labels = {
          app = "alertmanager"
        }
      }

      spec {
        container {
          name  = "alertmanager"
          image = "prom/alertmanager:v0.27.0"

          args = [
            "--config.file=/etc/alertmanager/config.yml",
            "--storage.path=/alertmanager"
          ]

          port {
            name           = "web"
            container_port = 9093
          }

          volume_mount {
            name       = "config-volume"
            mount_path = "/etc/alertmanager"
          }
          volume_mount {
            name       = "storage-volume"
            mount_path = "/alertmanager"
          }
        }

        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map.alertmanager_config.metadata.0.name
          }
        }

        volume {
          name = "storage-volume"
          empty_dir {}
        }
      }
    }
  }
}

resource "kubernetes_service" "alertmanager" {
  metadata {
    name      = "alertmanager"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    selector = {
      app = "alertmanager"
    }

    port {
      name        = "web"
      port        = 9093
      target_port = "web"
    }
  }
}
