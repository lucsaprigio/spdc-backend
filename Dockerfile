FROM node:20-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install tsup

COPY . .

RUN npm run build

EXPOSE 3334

CMD ["npm", "run", "start:prod"]