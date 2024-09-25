FROM node:latest as build

COPY . .

RUN npm i
RUN npm build

FROM node:latest

WORKDIR /app

COPY --from=build dist  .
COPY --from=build package.json .

RUN npm run prepare:production

EXPOSE 8000

CMD [ "npm", "start" ]
