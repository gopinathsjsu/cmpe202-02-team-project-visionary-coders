# Deployment (AWS EC2 + Auto Scaling + ALB)

1. Build & push Docker image to ECR.
2. Create Launch Template that pulls the image and runs the container.
3. Create Auto Scaling Group (min 2, desired 2) attached to an Application Load Balancer.
4. Security groups: ALB (80/443) -> EC2 (8000).
5. Use SSM Parameter Store or Secrets Manager for secrets.
6. Use RDS Postgres in private subnet, or start with SQLite on EBS volume.
7. Point your domain to the ALB (Route 53).

See `docs/diagrams.md` for reference deployment diagram.
