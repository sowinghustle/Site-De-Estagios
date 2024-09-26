FROM node:latest

WORKDIR /app

COPY . .

RUN npm run prepare:production
RUN npm run build

EXPOSE 8000

CMD [ "npm", "start" ]
