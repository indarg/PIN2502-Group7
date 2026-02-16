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
  # REFERENCIA DIRECTA: Usamos el nombre de la imagen tal cual
  image = "postgres:15-alpine" 
  name  = "db_final_bariloche_v2"

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
