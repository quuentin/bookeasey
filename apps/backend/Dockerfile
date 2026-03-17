FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --omit=dev && npx prisma generate

# Copy source
COPY . .

# Expose port
EXPOSE 4000

# Run migrations then start
CMD npx prisma migrate deploy && node --import tsx src/index.ts
