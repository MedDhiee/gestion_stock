# ---------------------------------------------------------
# ConfigMap : Règles d'alerte pour Prometheus
# ---------------------------------------------------------
resource "kubernetes_config_map" "prometheus_alert_rules" {
  metadata {
    name      = "prometheus-alert-rules"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  data = {
    "alert.rules.yml" = file("${path.module}/prometheus/alert.rules.yml")
  }
}

# ---------------------------------------------------------
# ConfigMap : Configuration de Prometheus
# ---------------------------------------------------------
resource "kubernetes_config_map" "prometheus_config" {
  metadata {
    name      = "prometheus-config"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  data = {
    "prometheus.yml" = <<-EOT
      global:
        scrape_interval: 15s

      rule_files:
        - /etc/prometheus/alert.rules.yml

      alerting:
        alertmanagers:
        - static_configs:
          - targets:
            - 'alertmanager:9093'

      scrape_configs:
        - job_name: 'gestiondestock-api'
          metrics_path: '/actuator/prometheus'
          static_configs:
            - targets: ['gestiondestock-api:8081']
    EOT
  }
}

# ---------------------------------------------------------
# Prometheus : Deployment & Service
# ---------------------------------------------------------
resource "kubernetes_deployment" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
    labels = {
      app = "prometheus"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "prometheus"
      }
    }
    template {
      metadata {
        labels = {
          app = "prometheus"
        }
      }
      spec {
        container {
          name  = "prometheus"
          image = "prom/prometheus:latest"

          port {
            container_port = 9090
          }

          volume_mount {
            name       = "config-volume"
            mount_path = "/etc/prometheus/prometheus.yml"
            sub_path   = "prometheus.yml"
          }
          volume_mount {
            name       = "alert-rules-volume"
            mount_path = "/etc/prometheus/alert.rules.yml"
            sub_path   = "alert.rules.yml"
          }
        }
        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map.prometheus_config.metadata[0].name
          }
        }
        volume {
          name = "alert-rules-volume"
          config_map {
            name = kubernetes_config_map.prometheus_alert_rules.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "prometheus_svc" {
  metadata {
    name      = "prometheus"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    type = "NodePort"
    selector = {
      app = "prometheus"
    }
    port {
      port        = 9090
      target_port = 9090
      node_port   = 30090
    }
  }
}

# ---------------------------------------------------------
# Grafana : PVC, ConfigMap Provisioning, Deployment & Service
# ---------------------------------------------------------

# Persistent Volume pour Grafana
resource "kubernetes_persistent_volume_claim" "grafana_pvc" {
  metadata {
    name      = "grafana-pvc"
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

# ConfigMap pour configurer automatiquement la DataSource Prometheus dans Grafana !
resource "kubernetes_config_map" "grafana_datasources" {
  metadata {
    name      = "grafana-datasources"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  data = {
    "prometheus.yaml" = <<-EOT
      apiVersion: 1
      datasources:
        - name: Prometheus
          type: prometheus
          access: proxy
          url: http://prometheus:9090
          isDefault: true
          editable: true
    EOT
  }
}

resource "kubernetes_deployment" "grafana" {
  metadata {
    name      = "grafana"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
    labels = {
      app = "grafana"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "grafana"
      }
    }
    template {
      metadata {
        labels = {
          app = "grafana"
        }
      }
      spec {
        security_context {
          fs_group     = 472
          run_as_user  = 472
        }
        container {
          name  = "grafana"
          image = "grafana/grafana"

          port {
            container_port = 3000
          }

          liveness_probe {
            http_get {
              path = "/api/health"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          volume_mount {
            name       = "grafana-data"
            mount_path = "/var/lib/grafana"
          }
          volume_mount {
            name       = "grafana-datasources"
            mount_path = "/etc/grafana/provisioning/datasources"
          }
        }

        volume {
          name = "grafana-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.grafana_pvc.metadata[0].name
          }
        }
        volume {
          name = "grafana-datasources"
          config_map {
            name = kubernetes_config_map.grafana_datasources.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "grafana_svc" {
  metadata {
    name      = "grafana"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    type = "NodePort"
    selector = {
      app = "grafana"
    }
    port {
      port        = 3000
      target_port = 3000
      node_port   = 30300
    }
  }
}
