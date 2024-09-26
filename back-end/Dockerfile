FROM node:latest AS builder

COPY . .
RUN npm install
RUN npm run build

FROM node:latest

WORKDIR /app

COPY --from=builder /dist ./dist
COPY --from=builder /package*.json ./
RUN npm run prepare:production

EXPOSE 8000

CMD ["npm", "start"]
