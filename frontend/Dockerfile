FROM node:12.13.1-slim

# create app directory
RUN mkdir -p /yelp/app/yelp-frontend-server
WORKDIR /yelp/app/yelp-frontend-server

# copy package.json file
COPY package.json /yelp/app/yelp-frontend-server
COPY package-lock.json /yelp/app/yelp-frontend-server

# install npm modules
RUN npm install --silent

# copy the frontend
COPY . /yelp/app/yelp-frontend-server

# run frontend server
CMD [ "npm", "start" ]