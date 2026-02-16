terraform {
  required_providers {
    # Usamos provider interno para máxima compatibilidad y evitar errores de API Docker
  }
}

# --- 1. RED (El puente de comunicación) ---
resource "terraform_data" "red_infra" {
  provisioner "local-exec" {
    # Crea la red 'red_terraform'. El "|| true" evita que falle si ya existe.
    command = "docker network create red_terraform || true"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "docker network rm red_terraform || true"
  }
}

# --- 2. BASE DE DATOS (El Almacén Blindado) ---
resource "terraform_data" "base_datos" {
  # Espera a que la red exista
  depends_on = [terraform_data.red_infra]

  provisioner "local-exec" {
    # -d: Segundo plano
    # --rm: Se borra al parar (porque los datos quedan en la carpeta pgdata)
    # -v: VOLUMEN -> Mapeamos la carpeta local "pgdata" adentro del contenedor
    # -p 5435: Usamos el puerto 5435 para NO chocar si tenés otro Postgres en el docker-compose
    command = "docker run -d --rm --name db_terraform --network red_terraform -p 5435:5432 -v $(pwd)/pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secreto123 postgres:15"
  }

  provisioner "local-exec" {
    when    = destroy
    # Detiene el contenedor suavemente
    command = "docker stop db_terraform || true"
  }
}

# --- 3. PGADMIN (La Torre de Control) ---
resource "terraform_data" "pgadmin" {
  # Espera a que la DB arranque
  depends_on = [terraform_data.base_datos]

  provisioner "local-exec" {
    # Conectado a la misma red 'red_terraform'
    # Puerto 5050 para la web
    command = "docker run -d --rm --name pgadmin_terraform --network red_terraform -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=admin@admin.com -e PGADMIN_DEFAULT_PASSWORD=admin dpage/pgadmin4"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "docker stop pgadmin_terraform || true"
  }
}
