FROM node:bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install

RUN npm run build

RUN npx prisma generate

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate-prod && npm run start"]

