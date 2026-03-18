FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

# v3 - force cache bust
COPY . .

EXPOSE 4000

CMD npx prisma migrate deploy && node --import tsx src/index.ts
