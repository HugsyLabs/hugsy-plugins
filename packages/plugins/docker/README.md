# @hugsy/plugin-docker

Docker container management plugin for Hugsy that focuses solely on Docker and Docker Compose operations.

## Features

- 🐳 Docker container management commands
- 📦 Docker image operations
- 🎼 Docker Compose orchestration
- 💾 Volume and network management
- 🔧 Dockerfile and compose file editing
- ⚠️ Safety checks for dangerous operations
- 🚀 BuildKit support enabled by default

## Installation

```bash
npm install @hugsy/plugin-docker
```

## Usage

Add to your `.hugsyrc.json`:

```json
{
  "plugins": ["@hugsy/plugin-docker"]
}
```

## What It Adds

### Permissions

**Allowed operations:**

- Container management (`ps`, `start`, `stop`, `restart`, `logs`, `inspect`)
- Image operations (`images`, `pull`, `build`, `tag`, `history`)
- Docker Compose (`up`, `down`, `ps`, `logs`, `build`, `exec`)
- Volume management (`volume ls`, `volume create`, `volume inspect`)
- Network management (`network ls`, `network create`, `network inspect`)
- Docker info and version
- Dockerfile and docker-compose.yml editing

**Ask before:**

- Running containers (`docker run`)
- Executing commands in containers (`docker exec`)
- Removing containers and images (`rm`, `rmi`)
- Pruning operations
- Pushing images (`docker push`)
- Compose with volume removal (`docker-compose down -v`)

**Denied:**

- System-wide destructive operations
- Force removal of all containers
- Force removal of all images

### Hooks

**Pre-operation:**

- Checks if Docker daemon is running
- Reminds about resource limits for `docker run`
- Checks for docker-compose file existence

**Post-operation:**

- Confirms image build completion
- Notifies about container status after compose up
- Reminds about volume preservation after compose down

### Environment Variables

- `COMPOSE_DOCKER_CLI_BUILD`: "1" (Use Docker CLI for building)
- `DOCKER_BUILDKIT`: "1" (Enable BuildKit for better builds)

## Single Responsibility

This plugin focuses **solely** on Docker operations:

- Container lifecycle management
- Image building and management
- Docker Compose orchestration
- Volume and network operations

It does NOT handle:

- Kubernetes operations (use a Kubernetes plugin)
- Cloud provider specifics (use cloud plugins)
- CI/CD pipelines (use CI/CD plugins)
- Application deployment (use deployment plugins)

## Common Workflows

### Container Management

```bash
docker ps                    # ✅ List running containers
docker start myapp          # ✅ Start container
docker logs myapp -f        # ✅ View logs
docker stop myapp           # ✅ Stop container
docker rm myapp             # ⚠️ Requires confirmation
```

### Docker Compose

```bash
docker-compose up -d        # ✅ Start services
docker-compose ps           # ✅ Check status
docker-compose logs         # ✅ View logs
docker-compose down         # ✅ Stop services
docker-compose down -v      # ⚠️ Requires confirmation
```

### Image Operations

```bash
docker build -t myapp .     # ✅ Build image
docker images               # ✅ List images
docker push myapp           # ⚠️ Requires confirmation
docker rmi myapp            # ⚠️ Requires confirmation
```

## License

MIT
