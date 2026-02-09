provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "app" {
  name   = "motorizando-vps"
  region = "nyc3"
  size   = "s-2vcpu-4gb"
  image  = "ubuntu-22-04-x64"

  ssh_keys = [var.ssh_key_fingerprint]

  user_data = file("${path.module}/cloud-init.yml")
}
