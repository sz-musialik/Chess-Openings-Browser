# Base image with Python
FROM python:3.14-slim

# Work directory setup
WORKDIR /app

# Dependency installation
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copying rest of the app
COPY . .

# Exposing backend port
EXPOSE 8000

# Starting the app
CMD ["python", "main.py"]
