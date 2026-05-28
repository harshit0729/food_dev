output "public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.food_app.public_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.food_app.id
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.food_app_sg.id
}
