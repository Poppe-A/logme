FROM node:22-bullseye

WORKDIR /app



COPY package.json ./
RUN yarn install --frozen-lockfile

COPY . .

# Lance Vite en mode dev
# CMD ["yarn", "workspace", "logme_frontend", "dev", "--host", "0.0.0.0"]