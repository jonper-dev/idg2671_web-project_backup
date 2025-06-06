### Dockerfile (backend)
FROM node:18

### Set working directory
WORKDIR /app

### Copy dependency files and install
COPY package*.json ./
RUN npm install

### Copy backend source code and uploads
COPY . .

### Serve frontend static files if needed
RUN mkdir -p ./frontend-dist
COPY ../frontend/dist ./frontend-dist

### Expose the backend port
EXPOSE 8080

### Start the server
CMD ["npm", "run", "server"]
