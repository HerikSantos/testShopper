

FROM node:20.13.1

WORKDIR /usr/app
COPY package*.json ./
COPY . .

RUN rm -rf  node_modules
RUN npm install --omit=dev
RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 3000
