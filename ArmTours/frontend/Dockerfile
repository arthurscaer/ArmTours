FROM node:latest

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

RUN chmod +x ./node_modules/.bin/vue-cli-service

COPY . .

EXPOSE 8003

CMD ["npm", "run", "serve"]
