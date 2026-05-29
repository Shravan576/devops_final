# DevOps Capstone Project Handbook: Multi-Tier Orchestrated Web Stack

This handbook details the architectural specifications, configuration scripts, and operational procedures for your **DevOps Capstone Project: DevOps-Based Containerized Smart E-Commerce Platform**.

---

## 🏛️ 1. Multi-Tier Capstone Architecture

The upgraded architecture transitions the application from a single-tier client-only simulation into a real-world multi-tier distributed production environment:

```
[ Presentation Tier ]       ➜  React.js UI (Served via Nginx Alpine Container)
         │
         ▼ (REST JSON queries)
[ Logic Tier API ]          ➜  Node.js & Express API Server (/api/products, /api/orders)
         │
         ▼ (Mongoose Connection)
[ Database Tier ]           ➜  MongoDB Database Container (StatefulSet / Persistent Volume)
         │
         ▼ (Daily Cron)
[ Cloud Backup Tier ]       ➜  AWS S3 Bucket Storage (Database dumps backup storage)
```

---

## 🛠️ 2. Deployment Automation via Ansible

Ansible handles configuration management and server provisioning, allowing you to prepare an AWS EC2 instance and launch the entire stack with a single playbook command.

### Inventory Configuration (`ansible/hosts`)
The inventory maps your target EC2 servers and binds SSH key parameters:
```ini
[webservers]
ec2-target-node ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/your-key.pem
```

### Running the Playbook (`ansible/playbook.yml`)
Executing this playbook automates the following actions on your target EC2 instance:
1. Installs core dependencies (`git`, `curl`, `ca-certificates`).
2. Registers Docker GPG keys and adds repositories.
3. Installs Docker Engine and the Docker Compose plugin.
4. Adds group permissions for the `ubuntu` user.
5. Clones the project codebase from your GitHub repository.
6. Launches the three-tier container stack (`frontend`, `backend`, `mongodb`) using `docker compose up -d`.

**To execute the playbook**:
```bash
ansible-playbook -i ansible/hosts ansible/playbook.yml
```

---

## 💾 3. Database Persistence in Kubernetes (StatefulSets)

In production environments, databases cannot run inside standard ephemerally stateless Pods because restarting a pod destroys its data. 

To solve this, we deployed MongoDB using a **StatefulSet** (`k8s/mongodb-statefulset.yaml`):
1. **Stable Network Identifiers**: Pods are named sequentially (`mongodb-0`, `mongodb-1`) instead of receiving random hashes.
2. **PersistentVolumeClaims (PVC)**: Dynamically binds a virtual volume from your cloud environment (e.g. AWS EBS) to mount at `/data/db`, ensuring database tables survive container destructions.
3. **Headless Service**: A routing service with `clusterIP: None` maps direct DNS paths to the database node.

---

## ☁️ 4. AWS S3 Database Backups

To prevent catastrophic dataloss, we wrote an automated backup script (`scripts/backup-to-s3.sh`) which runs daily as a cron job:
1. Triggers `mongodump` to extract binary DB exports.
2. Archives the export folders into a compressed tar file (`mongodb_backup_YYYY-MM-DD.tar.gz`).
3. Uses the AWS CLI tool to push the archive directly to your AWS S3 bucket.
4. Deletes local temporary files to preserve EC2 disk space.

**To run the backup script manually**:
```bash
chmod +x scripts/backup-to-s3.sh
./scripts/backup-to-s3.sh
```

---

## 🚀 5. How to Deploy & Demo the Capstone

### A. Run Multi-Tier Stack via Docker Compose
```bash
# Launch Mongo, Express API, React Nginx client, and Exporter
docker-compose up -d --build

# Verify container lists
docker compose ps
```
The React frontend (port `8080`) communicates directly with the Express API (port `5000`), which writes product states and purchases into MongoDB (port `27017`).

### B. Deploy to Kubernetes
```bash
# Apply secrets and database stateful volume
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb-statefulset.yaml

# Apply ConfigMaps and Pod Deployments
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

---

## 🎓 6. Capstone Viva Q&A (Database & Configuration)

### Q1: Why did you use Ansible instead of shell scripts for EC2 provisioning?
**Answer**: Ansible is **idempotent**, meaning it checks the state of the server before executing a task. If Docker is already installed, Ansible skips the step. A shell script would blindly attempt to reinstall, causing installation loops or errors.

### Q2: What is the benefit of MongoDB in this Capstone project?
**Answer**: By integrating MongoDB, we showcase a real-world multi-tier application. This allows us to demonstrate Kubernetes state storage management (Persistent Volumes), headless cluster service discovery, and database security integrations via Kubernetes Secret bindings.
