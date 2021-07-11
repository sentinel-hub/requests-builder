from node:14.8.0-alpine as builder

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app
RUN npm run build


FROM nginx:1.19.2-alpine

COPY --from=builder /app/build /usr/share/nginx/html
