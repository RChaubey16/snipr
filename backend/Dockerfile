FROM node:22.14.0-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

CMD ["pnpm", "run", "start:dev"]
