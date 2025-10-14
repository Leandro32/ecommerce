# Dockerfile for Next.js Application

# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock* ./ 
RUN yarn install --frozen-lockfile

# 2. Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time arguments
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_IMAGE_CDN_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_IMAGE_CDN_URL=${NEXT_PUBLIC_IMAGE_CDN_URL}
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=${NEXT_PUBLIC_WHATSAPP_NUMBER}

RUN yarn build

# 3. Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["yarn", "start"]
