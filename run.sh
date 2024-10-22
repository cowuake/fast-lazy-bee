#!/usr/bin/env bash

# Load environment variables
cp .env.sample .env
. ./.env

SAMPLE_DATA_ARCHIVE_LOCATION=/tmp/sampledata.archive

# Check local environment
echo "> Checking local environment..."
if [ ! -x "$(command -v docker)" ]; then
    echo "> Docker is not installed! Please install Docker."
    exit 1
elif [ ! -x "$(command -v docker-compose)" ]; then
    echo "> Docker Compose is not installed! Please install Docker Compose."
    exit 1
elif [ ! -x "$(command -v curl)" ]; then
    echo "> cURL is not installed! Please install cURL."
    exit 1
elif [ -z $MONGO_CONTAINER_NAME ]; then
    echo "> MONGO_CONTAINER_NAME is not set! Please set MONGO_CONTAINER_NAME."
    exit 1
elif [ -z $APP_HOST_PORT ]; then
    echo "> APP_HOST_PORT is not set! Please set APP_HOST_PORT."
    exit 1
fi
echo "> Local environment is ready!"

# Docker Compose up
echo "> Running Docker Compose..."
docker-compose up --build -d

# Announce that FastLazyBee is up and running
echo "> FastLazyBee is up and running! Please wait for initial data to be loaded into the database..."

# Download the official MongoDB sample data archive (dump) from AWS S3
if [ ! -f $SAMPLE_DATA_ARCHIVE_LOCATION ]; then
    echo "> Downloading the official MongoDB sample data archive (dump) from AWS S3..."
    curl https://atlas-education.s3.amazonaws.com/sampledata.archive > $SAMPLE_DATA_ARCHIVE_LOCATION
    echo "> Sample data archive downloaded successfully!"
fi

# Copy the sample data archive to the MongoDB container
docker cp $SAMPLE_DATA_ARCHIVE_LOCATION $MONGO_CONTAINER_NAME:/$SAMPLE_DATA_ARCHIVE_LOCATION

# Restore the sample data archive in the MongoDB container
docker exec $MONGO_CONTAINER_NAME mongorestore --archive=/$SAMPLE_DATA_ARCHIVE_LOCATION --drop

# Announce that the initial data has been loaded successfully and provide the URL to access the FastLazyBee app
echo "> Initial data loaded successfully!"
echo "> You can now run the FastLazyBee app by opening http://localhost:$APP_HOST_PORT/docs in your browser."
