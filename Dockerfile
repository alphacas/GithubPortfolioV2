# Using the official docker image node:18-alpine, use 'base' as the alias?
FROM node:18-alpine AS base
FROM base AS deps

# Run docker build --no-cache
RUN apk add --no-cache libc6-compat

# Terminal equivalent of = CD /app
WORKDIR /app

#COPY SOURCE => Destination (In this case, copy package and yarnlock into ./) and then install deps
COPY package.json yarn.lock ./
RUN yarn install --production

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disables telemetry to nextjs, speeds up our processes
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Configuring the runtime environment from here down
FROM base AS runner
WORKDIR /app

ENV GITHUB_USERNAME eddiefahrenheit 
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# To the best of my knowledge, docker creates a server and we are creating a group and a user of that group on that server here
# Similar to how you try not to use the root user on AWS, for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 alphacas

COPY --from=builder /app/public ./public
COPY --from=builder --chown=alphacas:nodejs /app/.next/standalone ./
COPY --from=builder --chown=alphacas:nodejs /app/.next/static ./.next/static
#COPY --from=builder --chown=alphacas:nodejs /app/.next ./.next
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package.json ./package.json

USER alphacas

EXPOSE 3000

ENV HOSTNAME localhost
ENV PORT 3000

CMD ["node", "server.js"]