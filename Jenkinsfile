pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')
        AWS_CREDENTIALS = credentials('aws-credentials-id')
        DOCKER_IMAGE = "prash2002/simplechat:v1.0"
        CLUSTER_NAME = "simplechat-eks"
        REGION = "ap-south-1"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKERHUB_CREDENTIALS') {
                        docker.image(DOCKER_IMAGE).push()
                    }
                }
            }
        }

        stage('Configure AWS CLI') {
            steps {
                withCredentials([string(credentialsId: 'aws-credentials-id', variable: 'AWS_CREDENTIALS')]) {
                    sh """
                        aws configure set aws_access_key_id ${AWS_CREDENTIALS_USR}
                        aws configure set aws_secret_access_key ${AWS_CREDENTIALS_PSW}
                        aws configure set region ${REGION}
                    """
                }
            }
        }

        stage('Update Kubeconfig') {
            steps {
                sh """
                    aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh """
                        kubectl set image deployment/your-deployment-name your-container-name=${DOCKER_IMAGE}
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment to EKS was successful!'
        }
        failure {
            echo 'Deployment to EKS failed.'
        }
    }
}
