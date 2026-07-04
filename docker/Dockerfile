FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS server-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server/ ./server/
COPY prisma/ ./prisma/
RUN npx prisma generate

FROM nginx:alpine AS frontend
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS api
WORKDIR /app
COPY --from=server-builder /app /app
COPY --from=builder /app/server/dist ./server/dist
EXPOSE 3000
CMD ["node", "server/dist/index.js"]