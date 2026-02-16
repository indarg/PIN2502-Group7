terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.25.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Definición de la imagen de PostgreSQL
resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

# Definición del contenedor de la Base de Datos
resource "docker_container" "postgres_container" {
  image = docker_image.postgres_image.image_id
  name  = "postgres_db"

  ports {
    internal = 5432
    external = 5432
  }

  env = [
    "POSTGRES_USER=myuser",
    "POSTGRES_PASSWORD=mypassword",
    "POSTGRES_DB=mydatabase"
  ]

  # Persistencia de datos en tu carpeta local pgdata
  volumes {
    host_path      = "${abspath(path.module)}/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}
