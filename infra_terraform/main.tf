terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

# Configuramos el proveedor para que use el socket local de la VM
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Definimos la imagen de Postgres
resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

# Creamos el contenedor de la Base de Datos
resource "docker_container" "db" {
  name  = "postgres_db"
  image = docker_image.postgres_image.image_id
  
  ports {
    internal = 5432
    external = 5432
  }

  env = [
    "POSTGRES_USER=myuser",
    "POSTGRES_PASSWORD=mypassword",
    "POSTGRES_DB=mydb"
  ]

  # Persistencia de datos en tu carpeta local
  volumes {
    host_path      = "${abspath(path.root)}/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}
