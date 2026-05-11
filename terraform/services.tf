# ---------------------------------------------------------
# MySQL Database
# ---------------------------------------------------------

resource "kubernetes_deployment" "mysql" {
  metadata {
    name      = "mysql"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
    labels = {
      app = "mysql"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mysql"
      }
    }
    template {
      metadata {
        labels = {
          app = "mysql"
        }
      }
      spec {
        container {
          name  = "mysql"
          image = "mysql:8.0"
          
          port {
            container_port = 3306
          }

          env {
            name = "MYSQL_ROOT_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.mysql_secret.metadata[0].name
                key  = "root-password"
              }
            }
          }
          env {
            name = "MYSQL_DATABASE"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.mysql_secret.metadata[0].name
                key  = "database-name"  # <--- METTEZ database-name ICI
              }
            }
          }
          
          # Paramètres requis par Spring Boot hibernate dialect / caching_sha2_password
          args = [
            "--default-authentication-plugin=caching_sha2_password",
            "--character-set-server=utf8mb4",
            "--collation-server=utf8mb4_unicode_ci"
          ]

          volume_mount {
            name       = "mysql-data"
            mount_path = "/var/lib/mysql"
          }

          liveness_probe {
            exec {
              command = ["mysqladmin", "ping", "-h", "localhost"]
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }
          readiness_probe {
            exec {
              command = ["mysqladmin", "ping", "-h", "localhost"]
            }
            initial_delay_seconds = 20
            period_seconds        = 5
          }
        }

        volume {
          name = "mysql-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.mysql_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mysql_svc" {
  metadata {
    name      = "mysql"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    selector = {
      app = "mysql"
    }
    port {
      port        = 3306
      target_port = 3306
    }
  }
}

# ---------------------------------------------------------
# Spring Boot Backend API
# ---------------------------------------------------------

resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "gestiondestock-api"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
    labels = {
      app = "gestiondestock-api"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "gestiondestock-api"
      }
    }
    template {
      metadata {
        labels = {
          app = "gestiondestock-api"
        }
      }
      spec {
        init_container {
          name    = "wait-for-mysql"
          image   = "busybox:1.36"
          command = ["sh", "-c", "until nc -z mysql 3306; do echo 'Waiting for MySQL...'; sleep 3; done; echo 'MySQL is ready!'"]
        }

        container {
          name  = "gestiondestock-api"
          # Remplacer 'userdockerhub' par votre username quand on passera depuis DockerHub
          image = "gestiondestock-backend" 
          image_pull_policy = "Never" # Pour tester avec l'image locale d'abord

          port {
            container_port = 8081
          }

          env {
            name  = "DB_URL"
            value = "jdbc:mysql://mysql:3306/gestion?createDatabaseIfNotExist=true&useSSL=false&useUnicode=true&serverTimezone=UTC&allowPublicKeyRetrieval=true"
          }
          env {
            name  = "SPRING_DATASOURCE_URL"
            value = "jdbc:mysql://mysql:3306/gestion?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
          }
          env {
            name  = "SPRING_DATASOURCE_USERNAME"
            value = "root"
          }
          env {
            name = "SPRING_DATASOURCE_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.mysql_secret.metadata[0].name
                key  = "root-password"
              }
            }
          }
          env {
            name  = "MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE"
            value = "health,prometheus"
          }
          env {
            name  = "MANAGEMENT_METRICS_TAGS_APPLICATION"
            value = "gestiondestock-api"
          }
          env {
            name  = "SPRING_PROFILES_ACTIVE"
            value = "prod"
          }

          liveness_probe {
            tcp_socket {
              port = 8081
            }
            initial_delay_seconds = 60
            period_seconds        = 15
            failure_threshold     = 5
          }
          readiness_probe {
            tcp_socket {
              port = 8081
            }
            initial_delay_seconds = 45
            period_seconds        = 10
            failure_threshold     = 5
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend_svc" {
  metadata {
    name      = "gestiondestock-api"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    type = "NodePort"
    selector = {
      app = "gestiondestock-api"
    }
    port {
      port        = 8081
      target_port = 8081
      node_port   = 30081
    }
  }
}

# ---------------------------------------------------------
# Angular Frontend UI
# ---------------------------------------------------------

resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "gestiondestock-ui"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
    labels = {
      app = "gestiondestock-ui"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "gestiondestock-ui"
      }
    }
    template {
      metadata {
        labels = {
          app = "gestiondestock-ui"
        }
      }
      spec {
        container {
          name  = "gestiondestock-ui"
          # Remplacer 'userdockerhub' par votre username
          image = "gestiondestock-frontend"
          image_pull_policy = "Never"

          port {
            container_port = 80
          }
          
          liveness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 15
            period_seconds        = 10
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend_svc" {
  metadata {
    name      = "gestiondestock-ui"
    namespace = kubernetes_namespace.app_namespace.metadata[0].name
  }

  spec {
    type = "NodePort"
    selector = {
      app = "gestiondestock-ui"
    }
    port {
      port        = 80
      target_port = 80
      node_port   = 30080
    }
  }
}
