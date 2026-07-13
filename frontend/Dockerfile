# Base image with Node
FROM node:24-alpine

# Work directory setup
WORKDIR /app

# Dependency installation
COPY package*.json .
RUN npm install

# Copying rest of the app
COPY . .

# Exposing frontend port
EXPOSE 5173

# Starting the app
CMD ["npm", "run", "dev", "--", "--host"]
