terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.15.0" # Versión garantizada para API 1.41
    }
  }
}

provider "docker" {
  # Forzamos la conexión al socket local
  host = "unix:///var/run/docker.sock"
}

resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_container" "postgres_container" {
  # En la v2.15.0 se usa .latest obligatoriamente para evitar errores de metadata
  image = docker_image.postgres_image.latest 
  name  = "db_final_ok"

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
