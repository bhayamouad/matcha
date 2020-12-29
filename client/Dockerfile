FROM node:12
WORKDIR /usr/src/client
RUN apt-get install ca-certificates
RUN openssl req -x509 -nodes -days 365 \
    -subj  "/C=MA/ST=CASA/O=Matcha Inc/CN=Matcha.app" \
     -newkey rsa:2048 -keyout /etc/ssl/private/matchasigned.key \
     -out /etc/ssl/certs/matchasigned.crt
CMD ["npm", "run", "dev"]
#CMD ["npm", "start"] production