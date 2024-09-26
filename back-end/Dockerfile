FROM node:latest AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM node:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm run prepare:production

EXPOSE 8000

CMD ["npm", "start"]
