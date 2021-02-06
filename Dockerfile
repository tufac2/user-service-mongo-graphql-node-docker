FROM node:14

# Create a working directory, copying packages and installing them
# node:14 comse already with NODE so we do not need to install it.
# Docker use a cache so we do not need to copy the entire code just the packages
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

RUN npm install nodemon -g --quiet
RUN npm audit fix

# Bundle app source by copying it
COPY . .

EXPOSE 2002

CMD ["npm", "run", "dev"]