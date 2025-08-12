FROM node:22-bullseye

WORKDIR /app

COPY package.json ./
RUN yarn install --frozen-lockfile

COPY . .

# CMD ["yarn", "start:prod"]