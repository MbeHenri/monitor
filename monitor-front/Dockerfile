FROM node:18-alpine AS builder

ENV NODE_ENV production
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# handle the future env variable begining by MONITOR_APP specify as value of real env variable 
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80 443

# Start the app
# CMD [ "npm", "start" ]

CMD [ "nginx", "-g", "daemon off;" ]