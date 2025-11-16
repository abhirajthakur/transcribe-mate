FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS release

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy production node_modules
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/public ./public

USER bun
EXPOSE 3000/tcp
CMD ["bun", "server.js"]
