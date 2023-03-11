# Using the official docker image node:18-alpine, use 'base' as the alias?
FROM node:18-alpine AS base
FROM base AS deps

# Run docker build --no-cache
RUN apk add --no-cache libc6-compat

# Terminal equivalent of = CD /app
WORKDIR /app

#COPY SOURCE => Destination (In this case, copy package and yarnlock into ./) and then install deps
#Since we're copying yarn.lock, you should RUN yarn install --frozen-lockfile
#Otherwise, don't COPY yarn.lock. This is currently redundant but it works so I will leave it for now.
COPY package.json yarn.lock ./
RUN yarn install --production

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# This command copies all our local project files minus everything in .dockerignore over to our container
COPY . .

# Disables telemetry to nextjs, speeds up our processes
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Configuring the runtime environment from here down
FROM base AS runner
WORKDIR /app

#Defining our env variables here. Anything that needs to be hidden should probably not be here, not sure.
ENV GITHUB_USERNAME eddiefahrenheit 
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# To the best of my knowledge, docker creates a server and we are creating a group and a user of that group on that server here
# Similar to how you try not to use the root user on AWS, for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 alphacas

# Important, nextjs builds the efficient version of the entire project? into the .next file
# The line in next.config.js, output: 'standalone', puts the efficient version into the 'standalone' folder to be copied over for production
COPY --from=builder /app/public ./public
COPY --from=builder --chown=alphacas:nodejs /app/.next/standalone ./
COPY --from=builder --chown=alphacas:nodejs /app/.next/static ./.next/static

USER alphacas

EXPOSE 3000

ENV HOSTNAME localhost
ENV PORT 3000

CMD ["node", "server.js"]