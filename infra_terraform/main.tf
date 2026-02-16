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
  # ESTA ES LA LÍNEA MÁGICA: Forzamos a Terraform a hablar en 1.41
  api_version = "1.41"
}

resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_container" "postgres_container" {
  # Usamos el nombre directamente para evitar el error de metadata
  image = docker_image.postgres_image.name 
  name  = "db_final_bariloche"

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
