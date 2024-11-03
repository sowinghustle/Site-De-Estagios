FROM node:18 AS builder

COPY . .
RUN npm install --verbose
RUN npm run build   

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /dist ./dist
COPY --from=builder /sequelize ./sequelize
COPY --from=builder .sequelizerc ./
COPY --from=builder package*.json ./

RUN npm run setup:production

CMD ["tail", "-f", "/dev/null"]
