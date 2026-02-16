terraform {
  # No necesitamos el bloque de providers de docker para esto
}

resource "null_resource" "docker_deploy" {
  # Este recurso se ejecutará cada vez que cambies algo o el contenedor no exista
  provisioner "local-exec" {
    command = <<EOT
      # 1. Limpiamos por si existe uno viejo
      sudo docker rm -f db_final_estable || true
      
      # 2. Corremos el contenedor usando el comando nativo de tu Docker 1.41
      sudo docker run -d \
        --name db_final_estable \
        --restart always \
        -p 5435:5432 \
        -e POSTGRES_PASSWORD=secreto123 \
        -v ${abspath(path.module)}/pgdata:/var/lib/postgresql/data \
        postgres:15-alpine
    EOT
  }
}
