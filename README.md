# Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:5050](http://localhost:5050) with your browser to see the result.

# Deploy on Netlify

setting build & deploy

```bash
npm run deploy
```

Publish directory

```
out
```

# Docker

## build image

```bash
docker build -t frontend-design .
```

## create container

```bash
docker run --env PORT=8888 --env=BASE_URL=http://127.0.0.1 -p 5050:8888 --name frontendDesign frontend-design
```

## stop & delete container

```bash
docker stop frontendDesign
docker rm frontendDesign
```

## delete image

```bash
docker rmi frontend-design
```
