## Build stage
FROM node:20-alpine AS build
WORKDIR /app

# prisma.config.ts requires DATABASE_URL to resolve just to load config, even for `prisma generate`
# (which does not open a connection). The real value is supplied at container runtime via env_file.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

## Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
RUN npx prisma generate

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-5000}/health/db" || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
