terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.15.0" 
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# ELIMINAMOS el resource "docker_image" para saltar el error de API

resource "docker_container" "postgres_container" {
  # Usamos el nombre de la imagen directamente
  image = "postgres:15-alpine" 
  name  = "db_final_despliegue_estable"

  ports {
    internal = 5432
    external = 5435
  }

  env = [
    "POSTGRES_PASSWORD=secreto123"
  ]

  volumes {
    host_path      = "${abspath(path.module)}/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}
