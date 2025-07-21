FROM node:23-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install tsup

COPY . .

RUN npm run build

EXPOSE 3334

CMD ["npm", "run", "start:prod"]