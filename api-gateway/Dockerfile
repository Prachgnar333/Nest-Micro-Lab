FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Enable NestJS watch mode
CMD ["npm", "run", "start:dev"]
