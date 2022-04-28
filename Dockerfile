FROM node:9-slim
WORKDIR /app
COPY . /app
RUN npm install express
EXPOSE 3000
CMD ["node", "app.js"]
