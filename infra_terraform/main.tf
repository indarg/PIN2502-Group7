terraform {
  required_providers {
    # Usamos provider interno para máxima compatibilidad
  }
}

# --- 1. RED (El puente de comunicación) ---
resource "terraform_data" "red_infra" {
  provisioner "local-exec" {
    # Crea la red si no existe
    command = "docker network create red_terraform || true"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "docker network rm red_terraform || true"
  }
}

# --- 2. BASE DE DATOS (El Almacén Blindado) ---
resource "terraform_data" "base_datos" {
  depends_on = [terraform_data.red_infra]

  provisioner "local-exec" {
    # -v $(pwd)/pgdata:... -> ESTO ES CLAVE. Persistencia en carpeta local.
    # Usamos puerto 5435 para no chocar con otros postgres que tengas.
    command = "docker run -d --rm --name db_terraform --network red_terraform -p 5435:5432 -v $(pwd)/pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secreto123 postgres:15"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "docker stop db_terraform || true"
  }
}

# --- 3. PGADMIN (La Torre de Control) ---
resource "terraform_data" "pgadmin" {
  depends_on = [terraform_data.base_datos]

  provisioner "local-exec" {
    # Interfaz web en puerto 5050
    command = "docker run -d --rm --name pgadmin_terraform --network red_terraform -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=admin@admin.com -e PGADMIN_DEFAULT_PASSWORD=admin dpage/pgadmin4"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "docker stop pgadmin_terraform || true"
  }
}
