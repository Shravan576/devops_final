#!/bin/bash

# ==============================================================================
# Jenkins, Java, and Docker Automated Installation Script for Ubuntu 22.04 LTS
# ==============================================================================

echo "============================================="
echo "Starting Jenkins CI/CD Setup Pipeline on EC2"
echo "============================================="

# 1. Update package lists
echo "1. Updating local packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install OpenJDK 17 (Required for Jenkins)
echo "2. Installing OpenJDK 17..."
sudo apt install -y openjdk-17-jre openjdk-17-jdk git curl gnupg

# 3. Add Jenkins GPG key and Repository
echo "3. Registering Jenkins repositories..."
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# 4. Install Jenkins
echo "4. Installing Jenkins automation server..."
sudo apt update
sudo apt install -y jenkins

# 5. Enable and start Jenkins service daemon
sudo systemctl enable jenkins
sudo systemctl start jenkins

# 6. Check if Docker is installed. If not, install it.
if ! command -v docker &> /dev/null
then
    echo "5. Installing Docker engines..."
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "5. Docker is already installed. Skipping installation."
fi

# 7. Configure Jenkins group permissions
echo "6. Adding jenkins account to docker group privileges..."
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu

# Restart services to apply group changes
echo "7. Restarting Jenkins to apply security group bindings..."
sudo systemctl restart jenkins

echo "============================================="
echo "Jenkins Setup Completed Successfully!"
echo "============================================="
echo "Access the Jenkins dashboard at: http://YOUR_EC2_PUBLIC_IP:8080"
echo ""
echo "Use the following passcode to unlock Jenkins:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo "============================================="
