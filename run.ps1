#!/usr/bin/env pwsh

# Load environment variables
Copy-Item -Path ".env.sample" -Destination ".env"
Get-Content .env | foreach {
    $name, $value = $_.split('=')
    if (-not(($name.Contains('#') -or $name -eq ''))) {
        [System.Environment]::SetEnvironmentVariable($name, $value)
    }
}
Get-Content ".env"

Set-Content env:SAMPLE_DATA_ARCHIVE_LOCATION "$env:TMP\sampledata.archive"
Set-Content env:SAMPLE_DATA_ARCHIVE_FINAL_LOCATION "/tmp/sampledata.archive"

# Check local environment
Write-Output "> Checking local environment..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Output "> Docker is not installed! Please install Docker."
    exit 1
} elseif (-not (Get-Command curl -ErrorAction SilentlyContinue)) {
    Write-Output "> cURL is not installed! Please install cURL."
    exit 1
} elseif (-not $env:MONGO_CONTAINER_NAME) {
    Write-Output "> MONGO_CONTAINER_NAME is not set! Please set MONGO_CONTAINER_NAME."
    exit 1
} elseif (-not $env:APP_HOST_PORT) {
    Write-Output "> APP_HOST_PORT is not set! Please set APP_HOST_PORT."
    exit 1
}
Write-Output "> Local environment is ready!"

# Docker Compose up
Write-Output "> Running Docker Compose..."
docker compose up --build --detach

# Announce that FastLazyBee is up and running
Write-Output "> FastLazyBee is up and running! Please wait for initial data to be loaded into the database..."

# Download the official MongoDB sample data archive (dump) from AWS S3
if (-not (Test-Path $env:SAMPLE_DATA_ARCHIVE_LOCATION)) {
    Write-Output "> Downloading the official MongoDB sample data archive (dump) from AWS S3..."
    # $ProgressPreference = 'SilentlyContinue'
    Start-BitsTransfer -Source "https://atlas-education.s3.amazonaws.com/sampledata.archive" -Destination $env:SAMPLE_DATA_ARCHIVE_LOCATION
    Write-Output "> Sample data archive downloaded successfully!"
}

# Copy the sample data archive to the MongoDB container
docker cp $env:SAMPLE_DATA_ARCHIVE_LOCATION "${env:MONGO_CONTAINER_NAME}:${env:SAMPLE_DATA_ARCHIVE_FINAL_LOCATION}"

# Restore the sample data archive in the MongoDB container
docker exec $env:MONGO_CONTAINER_NAME mongorestore --archive=$env:SAMPLE_DATA_ARCHIVE_FINAL_LOCATION --drop

# Announce that the initial data has been loaded successfully and provide the URL to access the FastLazyBee app
Write-Output "> Initial data loaded successfully!"
Write-Output "> You can now run the FastLazyBee app by opening http://localhost:$env:APP_HOST_PORT/docs in your browser."
