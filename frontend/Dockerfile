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

EXPOSE 3000

CMD ["pnpm", "run", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
