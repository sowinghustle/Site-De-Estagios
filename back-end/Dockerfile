FROM node:latest

WORKDIR /app

COPY . .

RUN npm prepare:production
RUN npm run build

EXPOSE 8000

CMD [ "npm", "start" ]
