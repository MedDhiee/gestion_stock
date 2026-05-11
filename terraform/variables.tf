variable "namespace_name" {
  description = "The name of the Kubernetes namespace for the project"
  type        = string
  default     = "gestionstock"
}

variable "mysql_root_password" {
  description = "Password for MySQL Root User"
  type        = string
  default     = "Med123456*"
  sensitive   = true
}

variable "mysql_database" {
  description = "Name of the MySQL Database"
  type        = string
  default     = "gestion"
}
