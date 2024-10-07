FROM node:20-bookworm-slim AS builder
RUN apt-get update && apt-get upgrade -y
WORKDIR /build
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm ci
RUN npm run build

FROM node:20-bookworm-slim
RUN apt-get update && apt-get upgrade -y && apt-get install -y dumb-init
ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
WORKDIR $APP_HOME
COPY --chown=node:node . $APP_HOME
COPY --chown=node:node --from=builder /build $APP_HOME
USER node
EXPOSE $APP_CONTAINER_PORT
ENTRYPOINT ["dumb-init"]
CMD ["npm", "start"]
