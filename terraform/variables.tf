variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "instance_name" {
  description = "EC2 instance name tag"
  default     = "food-devops"
}

variable "key_name" {
  description = "SSH key pair name for EC2"
  default     = "food-key"
}

variable "allowed_ports" {
  description = "Inbound ports for security group"
  type        = list(number)
  default     = [22, 80, 443, 3000, 5000, 9090, 3000, 30080, 30000]
}
