# Using the official docker image node:18-alpine
FROM node:18-alpine AS base

# Think of this file as 3 phases, install dependencies(deps), the build phase (builder), and run time configuration (runner)
FROM base AS deps

# Install with --no-cache, libc6-compat, aka glibc, version 2 of the GNU C Library needed to run most/all linux programs
RUN apk add --no-cache libc6-compat

# Terminal equivalent of = CD /app when we are in the container
WORKDIR /app

#COPY SOURCE => Destination (In this case, copy package and yarnlock into our container at ./) and then install deps
# The --production tag means we are NOT installing dev dependencies
# This COPY is run in exec form, it works the same way as the following COPY, arguments are just written in an array of strings
COPY ["package.json", "yarn.lock", "./"]
RUN yarn --production

# Build
FROM base AS builder
WORKDIR /app
# Hypothesis: node_modules are built in production, but not in development environment
COPY --from=deps /app/node_modules ./node_modules
# This command copies all our local project files minus everything in .dockerignore over to our container
COPY . .

# Disables telemetry to nextjs during build, speeds up our processes
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Configuring the runtime environment from here down
FROM base AS runner
WORKDIR /app

#Defining our run time 'process.env' variables here
ENV GITHUB_USERNAME eddiefahrenheit 
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Creating non-root group and user here so that they don't have root privileges for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 alphacas

# Hypothesis: Nextjs builds the efficient version of the entire project into the .next file (TS => JS, Dev organization things are taken away)
# In next.config.js, output: 'standalone', tells the efficient version to go into the standalone folder
# Copy all these files from the builder section up above, into the container
COPY --from=builder /app/public ./public
COPY --from=builder --chown=alphacas:nodejs /app/.next/standalone ./
COPY --from=builder --chown=alphacas:nodejs /app/.next/static ./.next/static

USER alphacas

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]