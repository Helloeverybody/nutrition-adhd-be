FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

CMD ["node", "/app/dist/main.js"]

EXPOSE 8080

