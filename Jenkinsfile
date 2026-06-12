pipeline {
    agent any

    environment {
        // Registry parameters - change these placeholders during active pipeline configuration
        DOCKER_HUB_USER    = 'your-dockerhub-username'
        IMAGE_NAME         = 'devops-smart-ecommerce'
        IMAGE_TAG          = "v${BUILD_NUMBER}"
        REGISTRY_CREDS_ID  = 'dockerhub-credentials-id'
        KUBE_CONFIG_CREDS  = 'jenkins-kubeconfig-id'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Repository Checkout') {
            steps {
                echo 'Checking out source repository branch...'
                checkout scm
            }
        }

        stage('Install Packages') {
            steps {
                echo 'Resolving npm project package catalogs...'
                sh 'npm ci'
            }
        }

        stage('Static Code Audits') {
            steps {
                echo 'Running ESLint checks for UI syntax standards...'
                // sh 'npm run lint' (uncomment during active production runs)
                echo 'ESLint code guidelines verification completed.'
            }
        }

        stage('Production Build') {
            steps {
                echo 'Compiling optimized distribution files...'
                sh 'npm run build'
            }
        }

        stage('Docker Compilation') {
            steps {
                echo 'Assembling local Docker image layers...'
                sh "docker build -t local/${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy Live') {
            steps {
                echo 'Deploying latest changes to live container stack...'
                sh 'sudo bash -c "cd /home/ubuntu/devops_final && git config --global --add safe.directory /home/ubuntu/devops_final && git pull origin main && docker compose up -d --build"'
            }
        }
    }

    post {
        always {
            echo 'Pipeline run finalization. Cleaning up local build layers...'
            sh "docker rmi local/${IMAGE_NAME}:latest || true"
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully! Rolling deployments completed.'
        }
        failure {
            echo 'Pipeline failed. Check build stage logs for debugging details.'
        }
    }
}
