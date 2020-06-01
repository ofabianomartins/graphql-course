FROM node:12.17

# File Author / Maintainer
LABEL authors="Fabiano Martins <fabiano.paula.martins@gmail.com>"

# set your port
ENV PORT 3000

WORKDIR /www

# Install app dependencies
COPY . /www

RUN yarn install 

COPY docker-entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# expose the port to outside world
EXPOSE $PORT

CMD ["yarn","start:production"]

