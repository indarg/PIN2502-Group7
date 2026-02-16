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

resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_container" "postgres_container" {
  # Cambiamos .latest por .image_id para evitar la advertencia de la imagen a8282c
  image = docker_image.postgres_image.image_id 
  name  = "db_produccion_final"

  ports {
    internal = 5432
    external = 5435
  }

  env = [
    "POSTGRES_PASSWORD=secreto123"
  ]

  # Persistencia real de datos
  volumes {
    host_path      = "${abspath(path.module)}/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}
