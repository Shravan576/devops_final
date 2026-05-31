#!/bin/bash

# ==============================================================================
# Jenkins, Java 21, and Docker Automated Installation Script for Ubuntu 22.04+
# ==============================================================================

echo "============================================="
echo "Starting Jenkins CI/CD Setup Pipeline on EC2"
echo "============================================="

# 1. Update package lists
echo "1. Updating local packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install OpenJDK 21 (Required for modern Jenkins)
echo "2. Installing OpenJDK 21..."
sudo apt install -y openjdk-21-jre openjdk-21-jdk git curl gnupg

# 3. Add Jenkins GPG key (with binary de-armoring)
echo "3. Registering Jenkins GPG keys..."
sudo rm -f /usr/share/keyrings/jenkins-keyring.asc
sudo rm -f /usr/share/keyrings/jenkins-keyring.gpg
sudo rm -f /etc/apt/sources.list.d/jenkins.list

sudo mkdir -p /usr/share/keyrings
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# 4. Add Jenkins Repository
echo "4. Registering Jenkins Debian Repository..."
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# 5. Install Jenkins
echo "5. Installing Jenkins automation server..."
sudo apt update
sudo apt install -y jenkins

# 6. Enable and start Jenkins service daemon
sudo systemctl enable jenkins
sudo systemctl start jenkins

# 7. Check if Docker is installed. If not, install it.
if ! command -v docker &> /dev/null
then
    echo "6. Installing Docker engines..."
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "6. Docker is already installed. Skipping installation."
fi

# 8. Configure Jenkins group permissions
echo "7. Adding accounts to docker group privileges..."
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu

# Restart services to apply group changes
echo "8. Restarting Jenkins to apply security group bindings..."
sudo systemctl restart jenkins

echo "============================================="
echo "Jenkins Setup Completed Successfully!"
echo "============================================="
echo "Access the Jenkins dashboard at: http://YOUR_EC2_PUBLIC_IP:8080"
echo ""
echo "Use the following passcode to unlock Jenkins:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo "============================================="
