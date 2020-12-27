FROM node:12
WORKDIR /usr/src/app
RUN npm install -g nodemon
ENV TZ=Africa/Casablanca
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get install ca-certificates
RUN openssl req -x509 -nodes -days 365 \
    -subj  "/C=MA/ST=CASA/O=Camagru Inc/CN=camagru.app" \
     -newkey rsa:2048 -keyout /etc/ssl/private/matchasigned.key \
     -out /etc/ssl/certs/matchasigned.crt
CMD ["npm", "start"]