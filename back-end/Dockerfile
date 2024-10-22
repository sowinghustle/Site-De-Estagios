FROM node:18 AS builder

COPY . .
RUN npm install --verbose
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /dist ./dist
COPY --from=builder /package*.json ./
RUN npm run prepare:production

EXPOSE 8000

CMD ["npm", "start"]
