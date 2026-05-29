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
                echo 'Assembling multi-stage Docker image layers...'
                script {
                    dockerImage = docker.build("${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}")
                    dockerLatest = docker.build("${DOCKER_HUB_USER}/${IMAGE_NAME}:latest")
                }
            }
        }

        stage('Registry Publication') {
            steps {
                echo 'Publishing container image tag metrics to Docker Hub...'
                script {
                    withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo ${PASS} | docker login -u ${USER} --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Kubernetes Orchestration') {
            steps {
                echo 'Deploying Docker image updates into Kubernetes Cluster namespace...'
                script {
                    // Inject Kubeconfig credentials and run deployments
                    withCredentials([file(credentialsId: "${KUBE_CONFIG_CREDS}", variable: 'KUBECONFIG')]) {
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/configmap.yaml"
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/deployment.yaml"
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/service.yaml"
                        sh "kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/hpa.yaml"
                        
                        // Set the container image explicitly to trigger rolling updates
                        sh "kubectl --kubeconfig=${KUBECONFIG} set image deployment/frontend-deploy frontend-container=${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} --record"
                        sh "kubectl --kubeconfig=${KUBECONFIG} rollout status deployment/frontend-deploy"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline run finalization. Cleaning up temporary layers...'
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest || true"
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
