FROM node:22-alpine

WORKDIR /app

# Copy backend package files
COPY apps/backend/package.json ./
COPY apps/backend/prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy backend source
COPY apps/backend/src ./src
COPY apps/backend/nixpacks.toml ./

EXPOSE 4000

# Run migrations then start
CMD npx prisma migrate deploy && node --import tsx src/index.ts
