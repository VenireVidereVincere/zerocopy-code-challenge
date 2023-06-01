# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Expose the server port (change it if necessary)
EXPOSE 3000

# Set the environment variable
ENV SECRET_KEY=secret-key

# Start the server
CMD [ "npm", "run", "start-server" ]