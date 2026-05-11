FROM node:16 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Install chaos engineering tools (tc for network latency, stress-ng for CPU/memory stress)
RUN apk add --no-cache iproute2 stress-ng

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist/hb_electronics /usr/share/nginx/html

EXPOSE 80