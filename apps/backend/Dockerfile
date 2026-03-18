FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY src ./src
COPY nixpacks.toml ./

EXPOSE 4000

CMD npx prisma migrate deploy && node --import tsx src/index.ts
