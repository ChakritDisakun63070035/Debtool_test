pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS=credentials('dockerhub')
    }

    stages {
        stage('Initialize Stage.') {
            steps {
                echo 'Initial : Delete  containers and images'
                echo "Current path is ${pwd()}"
                bat "docker-compose down --rmi local"
            }
        }

        stage('Build Stage') {
            steps {
                echo "Build : Current path is ${pwd()}"
                bat "docker-compose build"
            }
        }
        stage('Login Stage') {
          steps {
            echo "Login : Logging in . . ."
            withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
                    bat 'docker login -u %DOCKERHUB_USR% -p %DOCKERHUB_PSW%'
            }
          }
        }

        stage('Push Stage') {
            steps {
                    echo "Push : Current path is ${pwd()}"
                    bat "docker-compose push"
            }
        }
        
        stage('Trigger Slave job') {
            steps {
                echo "Trigger : calling Slave job . . ."
                bat 'echo "HELLO ${DOCKERHUB_CREDENTIALS_USR}"'
                build job: 'slave', parameters: [string(name: 'DOCKERHUB_CREDENTIALS_USR', value: env.DOCKERHUB_CREDENTIALS_USR), string(name: 'DOCKERHUB_CREDENTIALS_PSW', value: env.DOCKERHUB_CREDENTIALS_PSW)]
            }
        }
    }
}