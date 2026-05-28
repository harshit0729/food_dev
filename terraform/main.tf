resource "aws_security_group" "food_app_sg" {
  name        = "food-app-sg"
  description = "Security group for FoodFlow AI"

  dynamic "ingress" {
    for_each = var.allowed_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.instance_name}-sg"
  }
}

resource "aws_instance" "food_app" {
  ami                    = "ami-0c7217cdde317cfec"
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.food_app_sg.id]

  tags = {
    Name = var.instance_name
  }

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
  }
}
