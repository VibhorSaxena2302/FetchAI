# Use an official Python runtime as a parent image
# Since Python 3.12.4 is not officially available, we'll use the latest Python 3 image
FROM python:3.12.4

# Set the working directory in the Docker container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . /app

# Set the Google Cloud credentials environment variable
# This is the path inside the container where you should place your credentials file.
# Ensure you copy this into your container or use a secret management approach.
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/google_cloud_api/uchat-431212-9a480821d1d4.json"

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable to configure Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]