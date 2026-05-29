# Project Viva/Oral Examination Preparation Guide

This document contains key conceptual questions, technical challenges, and expert-level answers to help you ace your final year DevOps engineering project presentation.

---

## 🐋 Category A: Docker & Containerization

### Q1: Why did you use multi-stage builds in your Dockerfile?
**Answer**: Multi-stage builds compile our React.js assets in an ephemeral Node container (Stage 1) and transfer ONLY the final optimized static bundle (stored in `/dist`) to a lightweight Alpine Nginx image (Stage 2). This eliminates Node node_modules, build caches, and compiler runtimes from the production image, bringing our image size down from **~450MB** to **~33MB**, improving pull latency and security.

### Q2: What is the purpose of Nginx in your containerized React application?
**Answer**: React is a Client-Side Rendered (CSR) Single Page Application (SPA). The built files are static HTML, CSS, and JS. We need Nginx to serve these files over HTTP. Additionally, we configured Nginx to fallback to `index.html` via `try_files $uri $uri/ /index.html` to prevent 404 errors when users refresh deep URLs in SPA routing.

### Q3: Difference between Docker Image and Docker Container?
**Answer**: An image is a read-only template with instructions for creating a container (like a class in programming). A container is a runnable instance of an image (like an object/instance of a class).

---

## ☸️ Category B: Kubernetes & Pod Scaling

### Q4: Explain the role of the Horizontal Pod Autoscaler (HPA) in your project.
**Answer**: HPA monitors CPU consumption across the pods in the deployment. In our `hpa.yaml`, we set the threshold to 70% CPU. If traffic increases and average CPU load exceeds 70%, the HPA contacts the Kubernetes control plane to spin up additional pods (from a minimum of 2 up to a maximum of 10) to distribute the incoming load.

### Q5: What is the difference between Readiness and Liveness probes?
**Answer**: 
* **Liveness Probe**: Determines if a container is running. If the liveness probe fails (e.g. infinite loop, memory lock), Kubernetes kills the pod and restarts it according to its restart policy.
* **Readiness Probe**: Determines if a container is ready to accept client traffic. If it fails, Kubernetes removes the pod from the Service endpoints list so no traffic is routed to it, until it passes.

### Q6: How do services communicate in Kubernetes? (Service vs Ingress)
**Answer**: 
* **Service**: Exposes a set of Pods internally (ClusterIP) or externally (LoadBalancer / NodePort) within the cluster network.
* **Ingress**: Acts as an API gateway or layer 7 reverse proxy. It sits at the edge of the cluster and routes external domain names (e.g. `ecommerce.devops.local`) to specific internal services based on paths.

---

## ⚙️ Category C: Jenkins CI/CD Pipelines

### Q7: Describe your CI/CD workflow in detail.
**Answer**: 
1. **Developer** commits code to GitHub.
2. A **GitHub Webhook** triggers a Jenkins build.
3. Jenkins runs the declarative pipeline stages defined in the `Jenkinsfile`:
   * **Stage 1 (Checkout)**: Clones git repository.
   * **Stage 2 (Install)**: Installs npm libraries.
   * **Stage 3 (Static Audit)**: Lints code layout.
   * **Stage 4 (Build)**: Compiles React code.
   * **Stage 5 (Docker Compile)**: Builds the Docker image.
   * **Stage 6 (Registry Push)**: Pushes image tagged with build numbers to Docker Hub.
   * **Stage 7 (Kubernetes Apply)**: Deploys manifests to Kubernetes using `kubectl apply` and triggers rolling restarts.

### Q8: What does `sh 'npm ci'` do in your Jenkinsfile? Why not `npm install`?
**Answer**: `npm ci` (clean install) is optimized for automated environments like CI pipelines. It bypasses package resolution, reads the exact package-lock.json structure, and deletes the existing `node_modules` before installing to guarantee deterministic builds.

---

## ☁️ Category D: AWS EC2 & Cloud Deployment

### Q9: How did you host your Dockerized application on AWS EC2?
**Answer**: We launched an Ubuntu Server 22.04 LTS instance, configured security groups to expose ports 80 (HTTP) and 22 (SSH). We then logged in via SSH, installed Docker, pulled our custom image from Docker Hub, and ran the container in background mode (`-d`) mapping port 80 to expose the website publicly.

### Q10: How would you secure your cloud deployment on AWS?
**Answer**: 
1. Place the database and backend nodes in a private subnet.
2. Restrict security groups (e.g. expose SSH port 22 only to my own IP).
3. Use HTTPS (SSL/TLS) via AWS Certificate Manager (ACM) bound to an Application Load Balancer.
4. Protect APIs with Web Application Firewalls (AWS WAF).

---

## 📈 Category E: Monitoring Concepts

### Q11: How do Prometheus and Grafana work together in your architecture?
**Answer**: 
* **Prometheus** acts as a time-series database. It pulls metrics from Nginx status pages and pod endpoints via periodic scrape tasks (pull model).
* **Grafana** acts as the visualization layer. It connects to Prometheus as a datasource, reads the collected metrics, and renders them in visual dashboards (e.g. graphs, gauges).
