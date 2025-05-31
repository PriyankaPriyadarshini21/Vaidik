# Get the directory where the script is located
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to that directory
Set-Location -Path $scriptPath

Write-Host "Current directory: $scriptPath"

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Start the development server
Write-Host "Starting development server..."
npm run dev 