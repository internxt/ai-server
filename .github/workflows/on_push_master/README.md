# Merging to the main branch

## Actions

### `deploy-project.yaml`

- Expects using Docker as the virtualization mechanism
  - The Action  [expects](./deploy-project.yml#L29) that the Docker remote repository should be called as the GitHub repository (p.e: if it is called "drive-server", the remote Docker repository should be called "drive-server" too).
  - The following variables are needed: 
    - `DOCKERHUB_USERNAME`: The DockerHub username
    - `DOCKERHUB_TOKEN`: The DockerHub [token](https://docs.docker.com/security/for-developers/access-tokens/)
- Expects Kubernetes as the technology to deploy the Docker image
  - The cluster should have the secret set up to pull Docker images from the desired repo. 
  - The cluster should have a deployment called as the GitHub repository. The container inside the deployment should also have the same name. 
  - The following variables are needed: 
    - `KUBE_CONFIG_DATA`: The kubeconfig file output in `base64` (obtain it using `cat /path/to/kubeconfig.yml | base64`)
