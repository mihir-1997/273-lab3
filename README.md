# Yelp

## Steps to run the application

### Using Docker

1. Use `docker-compose.yml` file to build and run the application. The file builds and creates two docker containers, one for `backend` and the other for `frontend`.

2. To deploy the application on server, provide a root level `.env` with appropriate values. For example,

```
BACKEND_URL="http://localhost"
FRONTEND_URL="http://localhost"
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

2. Build the images

```
docker-compose build
```

3. Run the application

```
docker-compose up
```

### Run locally without docker

1. Install necesary node modules for both frontend and backend

```
cd backend
npm i
cd ../frontend
npm i
```

2. Start frontend and backend server

```
cd backend
npm start
cd ../frontend
npm start
```
