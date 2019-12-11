FROM node:12.2.0

LABEL maintainer="Melissa LI <melissa.li@intersystems.com>"

EXPOSE 4200

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

WORKDIR /home/node/app

# Adding Node App source code
ADD ./app/ /home/node/app

RUN npm install

CMD ng serve