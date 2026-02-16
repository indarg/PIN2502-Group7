terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.15.0" # Versión estable para tu API de Docker
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_container" "postgres_container" {
  image = docker_image.postgres_image.latest
  name  = "db_terraform_final" # Cambiamos el nombre para evitar conflictos

  ports {
    internal = 5432
    external = 5435 # Usamos el 5435 como tenías en tu script
  }

  env = [
    "POSTGRES_PASSWORD=secreto123"
  ]

  # Esta es la clave de la permanencia de datos
  volumes {
    host_path      = "${abspath(path.module)}/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}
