FROM node:12.13.1-slim

# create app directory
RUN mkdir -p /yelp/app/yelp-backend-server
WORKDIR /yelp/app/yelp-backend-server

# copy package.json file
COPY package.json /yelp/app/yelp-backend-server
COPY package-lock.json /yelp/app/yelp-backend-server

# install npm modules
RUN npm install --silent

# copy the backend
COPY . /yelp/app/yelp-backend-server

# run backend server
CMD [ "npm", "start" ]