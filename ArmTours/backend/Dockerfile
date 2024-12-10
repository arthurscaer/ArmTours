FROM node:latest

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]
