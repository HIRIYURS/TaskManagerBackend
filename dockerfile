FROM node:8
RUN mkdir -p /usr/src/taskmgrangapp
WORKDIR /usr/src/taskmgrangapp
COPY package.json /usr/src/taskmgrangapp
RUN npm install
COPY . /usr/src/taskmgrangapp
EXPOSE 8001
CMD ["npm" "start"]