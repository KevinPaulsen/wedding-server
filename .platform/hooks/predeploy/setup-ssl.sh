#!/bin/bash
# Create directories if they don't exist
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Copy the certificate and key from your source bundle to the proper locations
sudo cp .platform/nginx/ssl/api_cert.pem /etc/ssl/certs/api_cert.pem
sudo cp .platform/nginx/ssl/api_priv.pem /etc/ssl/private/api_priv.pem

# Secure the private key file
sudo chmod 600 /etc/ssl/private/api_priv.pem

