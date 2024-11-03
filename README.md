# Fast Lazy Bee

[![CI](https://github.com/cowuake/fast-lazy-bee/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/cowuake/fast-lazy-bee/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/cowuake/fast-lazy-bee/badge.svg?branch=main)](https://coveralls.io/github/cowuake/fast-lazy-bee?branch=main)

Fast Lazy Bee is a toy *RESTful API* developed in TypeScript with the [Fastify](https://fastify.dev/) framework for educational purposes.

## How to run locally

Two different options are available for running Fast Lazy Bee in your local machine.

> N.B.: Regardless of the local run strategy you choose, you must be sure the Docker Engine is running before launching Fast Lazy Bee.

### Common requirements

| Tool                           | Version        | Required by                                         |
| ------------------------------ | -------------- | --------------------------------------------------- |
| Docker                         | (a recent one) | [Strat. 1](#strategy-1) and [Strat. 2](#strategy-2) |
| Docker Compose[^DockerCompose] | (a recent one) | [Strat. 1](#strategy-1)                             |
| Node.js[^Node]                 | 21.7.3         | [Strat. 2](#strategy-2)                             |

[^Node]: Use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) for installing the required version.

[^DockerCompose]: Be sure the new `docker compose` syntax (no hyphen!) is available.
Long story short, you should have the Compose plugin (v2) installed for the Docker CLI, not the original Docker Compose implementation (v1).
See replies to [this question in Stack Overflow](https://stackoverflow.com/questions/66514436/difference-between-docker-compose-and-docker-compose).

### Strategy 1

 This is the recommended strategy, and it requires Docker and the Docker Compose plugin to be installed on your system. No need for a local MongoDB instance or another Node.js version installed on your machine!

The provided run scripts perform a multi-container setup that will result in two containers for the application (*fastLazyBee-app*) and the database (*fastLazyBee-mongo*), respectively.

#### GNU/Linux and macOS

Give the run script execution permission with `chmod +x ./run.sh`, then launch it with

```bash
./run.sh
```

Assuming the script will have successfully completed its execution, it should communicate the URL where to play with the API via SwaggerUI.
The link should be [http://localhost:3042/docs](http://localhost:3042/docs).

When you're done, eradicate the poor API from this world by simply launching

```bash
docker compose down --remove-orphans --volumes
```

#### Windows

Launch the run script with:

```powershell
.\run.ps1
```

From here on, no significant differences compared to [GNU/Linux and macOs](#gnulinux-and-macos).

### Strategy 2

The application is run within a test environment so that no running database container is expected to be there beforehand, nor do you need to directly interact with Docker.

A fresh (dockerized) MongoDB instance is automatically provisioned by [Testcontainers](https://testcontainers.com/), and torn down when the life cycle of the application ends.
No changes to the initial state of the database due to server activity are persisted after teardown, nor should you expect container junk to be left around.

Install the project dependencies with `npm ci`, then run the command:

```shell
NODE_ENV=test npm run dev
```

You can stop the application and trigger container teardown at any time by simply pressing Ctrl+C in the terminal window whence you run the script.
