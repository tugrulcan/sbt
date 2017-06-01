# create a file named Dockerfile
FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
EXPOSE 5959
CMD ["npm", "start"]