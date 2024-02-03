FROM node:18-alpine
WORKDIR /dist/src
COPY . .
RUN npm install
RUN npm build
EXPOSE 6000
CMD ["npm", "start"]