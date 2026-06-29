FROM node:22 AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --os=linux --cpu=x64 sharp

FROM node:22-slim AS runtime

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
