FROM node:22-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN echo ">>> Executando build..." && \
    npm run build || (echo "!!! Build falhou" && exit 1) && \
    ls -la /app/build  # Lista o conteúdo da pasta build

EXPOSE 3334

CMD ["npm", "run", "start:prod"]