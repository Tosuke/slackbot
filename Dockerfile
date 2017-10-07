# build env
FROM mhart/alpine-node:latest AS build-env
RUN apk update && apk add --no-cache alpine-sdk openssl

# build
RUN mkdir -p work
WORKDIR /work
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY src src
RUN yarn install && yarn build


# run env
FROM mhart/alpine-node:latest
RUN apk update && apk add --no-cache openssl
RUN yarn global add forever

ENV NODE_EMOJI_TYPE=twitter
ENV NODE_ENV=production

RUN mkdir -p app
WORKDIR /app
COPY --from=build-env /work/package.json package.json
COPY --from=build-env /work/dist dist
RUN yarn install

CMD forever -f dist/index.js

