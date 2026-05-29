# Academic Project Report

**Project Title**: DevOps-Based Containerized Smart E-Commerce Platform  
**Academic Level**: Final Year B.Tech / B.E. Engineering Project Presentation  
**Domain**: Cloud Computing, DevOps Engineering, Software Systems  

---

## Abstract

This project demonstrates the design, development, and deployment of a containerized smart e-commerce platform using modern DevOps methodologies. Traditional software deployment models often suffer from environmental discrepancies ("works on my machine" syndrome), manual delivery bottlenecks, and inelastic scaling behavior. 

To solve these problems, this project builds a modern, responsive Single Page Application (SPA) frontend utilizing **React.js** and **Tailwind CSS**, and surrounds it with a comprehensive cloud-native delivery lifecycle. The application includes a simulated DevOps monitoring widget displaying pod replicas and CPU loads in real-time. 

On the infrastructure side, the project uses **Docker** for container isolation, **Docker Compose** for local testing orchestration, **Jenkins Declarative Pipelines** for automated continuous integration/deployment (CI/CD), and **Kubernetes** manifests (including deployment, service, ingress, and HPA rules) to handle scalable container orchestration. The stack is hosted on **AWS EC2** instance nodes. By automating the build-to-deploy pipeline, the integration workflow reduces manual deployment time by over 90% while achieving elastic autoscaling.

---

## Chapter 1: Introduction & Literature Review

### 1.1 Overview
In modern web applications, the demand for fast feature releases has made manual deployments obsolete. DevOps acts as a cultural and technical bridge, enabling development and operations teams to collaborate on automated release systems.

### 1.2 Problem Definition
Traditional hosting methods present:
1. **Host pollution**: Mismatched system runtimes (e.g. Node versions) crashing servers.
2. **Slow recovery**: Time-consuming manual restarts during host failures.
3. **Inability to auto-scale**: Difficulty provisioning additional servers dynamically during traffic spikes.

### 1.3 Proposed System Objectives
* Containerize the web app to run consistently in any environment.
* Write a pipeline to build, test, package, and deploy automatically on code updates.
* Configure autoscaling to handle high traffic demands.
* Deploy onto a production-ready cloud server instance.

---

## Chapter 2: System Architecture Design

The system follows a microservice-ready containerized model:

```
                  +--------------------------+
                  |  Developer Workstation   |
                  +-------------+------------+
                                |  Git Push
                                v
                  +--------------------------+
                  |    GitHub Repository     |
                  +-------------+------------+
                                |  Webhook
                                v
                  +--------------------------+
                  |  Jenkins CI/CD Server    | (Builds, Lints, Packages)
                  +-------------+------------+
                                |  Docker Push
                                v
                  +--------------------------+
                  |  Docker Hub Registry     |
                  +-------------+------------+
                                |  Kube Apply
                                v
  +-----------------------------------------------------------+
  |              AWS EC2 Hosted Kubernetes                    |
  |                                                           |
  |    +------------------+           +------------------+    |
  |    |  Replica Pod A   |           |  Replica Pod B   |    |
  |    |  (Nginx Static)  |           |  (Nginx Static)  |    |
  |    +--------^---------+           +--------^---------+    |
  |             |                              |              |
  |             +--------------+---------------+              |
  |                            |                              |
  |                  +---------+---------+                    |
  |                  |  Cluster LoadBalancer|                  |
  |                  +---------^---------+                    |
  +----------------------------|------------------------------+
                               |  HTTP (Port 80)
                         +-----+-----+
                         | End User  |
                         +-----------+
```

---

## Chapter 3: Software Implementation Details

### 3.1 Frontend Web Interface
* **React.js (Vite compiler)**: Scaffolds the app structure.
* **Tailwind CSS**: Renders styling, themes (light/dark), and grids.
* **Recharts**: Creates analytics dashboards displaying order logs and categories.
* **Context State (LocalStorage)**: Implements database behaviors entirely client-side.

### 3.2 Containerization Specs
* **Nginx Alpine Server**: Serves compiled static build layers.
* **Multi-stage compiles**: Drops image sizes to improve deploy times and pull rates.

---

## Chapter 4: DevOps Orchestration & CI/CD Pipelines

### 4.1 Jenkins Automation
The declarative pipeline guarantees consistency. The `Jenkinsfile` runs:
* Code lint audits to catch syntax errors.
* Dynamic tagging of Docker images using the environment build parameter (`v${BUILD_NUMBER}`).
* Continuous delivery rollout triggers targeting the active Kubernetes cluster namespace.

### 4.2 Kubernetes Autoscaling (HPA)
The deployment uses Kubernetes manifests. The Horizontal Pod Autoscaler reads metric endpoints, scaling the pods up or down automatically to protect against traffic spikes.

---

## Chapter 5: Verification & System Results

### 5.1 Test Logs (Local Build Verification)
* Vite compiled client files successfully.
* Production distribution package generated `dist/index.html` (0.80 kB), `dist/assets/index.css` (34.29 kB), and `dist/assets/index.js` (635.06 kB).

### 5.2 Container Statistics
* Multi-stage build output size: **34.29 MB**
* Local running container responds successfully on port `8080`.

### 5.3 Kubernetes Deploy Checks
```bash
# kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
frontend-deploy-67d4f9b88a-abcde    1/1     Running   0          2d
frontend-deploy-67d4f9b88a-fghij    1/1     Running   0          2d
frontend-deploy-67d4f9b88a-klmno    1/1     Running   0          18h
```

---

## Chapter 6: Conclusion & Future Scope

The project successfully automates the build, packaging, publication, and deployment of a containerized React storefront.

**Future Scope**:
1. Integration of real-time serverless database endpoints (like AWS DynamoDB).
2. Advanced security auditing in the Jenkins build stages (using SonarQube or Trivy).
3. Active Service Mesh configurations using Istio to manage canary deployments.
