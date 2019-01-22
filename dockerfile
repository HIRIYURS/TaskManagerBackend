FROM node:10
RUN mkdir -p /usr/src/taskmgrbackend
WORKDIR /usr/src/taskmgrbackend
COPY package.json /usr/src/taskmgrbackend
RUN npm install
COPY . /usr/src/taskmgrbackend
EXPOSE 8001
CMD ["npm" "start"]
