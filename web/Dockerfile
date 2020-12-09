FROM node:12
WORKDIR /usr/src/app
RUN npm install -g nodemon
ENV TZ=Africa/Casablanca
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
CMD ["npm", "start"]