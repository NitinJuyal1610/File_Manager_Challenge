#BUILD STAGE
FROM node:18-alpine

#DEV
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install 
COPY . .
RUN yarn db:push

EXPOSE 3000

CMD ["yarn","run" ,"dev"]