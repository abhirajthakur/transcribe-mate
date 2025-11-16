FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lock /temp/dev/
WORKDIR /temp/dev
RUN bun install --frozen-lockfile

COPY package.json bun.lock /temp/prod/
WORKDIR /temp/prod
RUN bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
