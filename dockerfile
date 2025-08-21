FROM node:20.2.0-alpine as base

RUN apk add --no-cache gcc musl-dev linux-headers sqlite

FROM base as deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM deps AS prod-deps
WORKDIR /app
RUN npm install --production

FROM base as runner
WORKDIR /app
COPY ./setup.sh ./
COPY ./database/init.sql ./database/init.sql
RUN chmod +r ./database/init.sql
RUN chmod +x ./setup.sh
RUN ./setup.sh ./database/portal-db.db > run-setup.log
RUN chmod -R +rw ./database

RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
RUN chown -R remix:remix ./database
USER remix

COPY --from=prod-deps --chown=remix:remix /app/package*.json ./
COPY --from=prod-deps --chown=remix:remix /app/node_modules ./node_modules
COPY --from=builder --chown=remix:remix /app/build ./build
COPY --from=builder --chown=remix:remix /app/public ./public

ENTRYPOINT [ "node", "node_modules/.bin/remix-serve", "build/index.js"]