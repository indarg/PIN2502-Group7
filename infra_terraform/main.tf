terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

# Configuramos el proveedor para usar el socket de Docker de la VM
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Definimos la imagen de Postgres (liviana)
resource "docker_image" "postgres_image" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

# Creamos el contenedor de la base de datos
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

  # Persistencia de datos en la carpeta pgdata
  volumes {
    host_path      = "${abspath(path.cwd)}/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}
