# Using the official docker image node:18-alpine
FROM node:18-alpine AS base

# Hypothesis: AS is like using an alias
# Think of this file as 3 phases, install dependencies(deps), the build phase (builder), and run time configuration (runner)
FROM base AS deps

# Install with --no-cache, libc6-compat, aka glibc, the GNU C Library needed to run most/all linux programs
# Hypothesis: Potentially not necessary for our preconfigured amazon linux server. Will test given the opportunity.
RUN apk add --no-cache libc6-compat

# Terminal equivalent of $ CD /app when we are in the container
WORKDIR /app

#COPY source, destination (In this case, copy package.json and yarn.lock into our container at ./) in order to install deps
# The --production tag means we are NOT installing dev dependencies
# This COPY is run in exec form, it works the same way as the following COPY, arguments are just written in an array of strings
COPY ["package.json", "yarn.lock", "./"]
# "yarn", is the same as "yarn install". Both check and try to use a frozen lockfile first, no need for --frozen-lockfile flag
RUN yarn

# Build
FROM base AS builder
WORKDIR /app
# Hypothesis: Yarn creates node_modules in production, but not in development environment?
COPY --from=deps /app/node_modules ./node_modules
# This command copies all our local project files minus everything in .dockerignore over to our container
COPY . .

# Defining process.env variables, if you add any keys here, at BARE MINIMUM, make sure to .gitignore this Dockerfile
# Disables telemetry to nextjs during build, speeds up our processes
ENV NEXT_TELEMETRY_DISABLED 1
# Hypothesis: Depending on where the project calls the env variables, static gen vs server side render,
# process.env variables may need to be either here or in run time configuration, respectively
ENV GITHUB_USERNAME eddiefahrenheit

# Hypothesis: Nextjs builds the efficient version of the entire project into the .next file (TS => JS, Dev organization things are taken away)
# In next.config.js, output: 'standalone', tells the efficient version to go into the standalone folder
RUN yarn build

# Configuring the runtime environment from here down
FROM base AS runner
WORKDIR /app

#Defining our run time environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Creating non-root group and user here so that they don't have root privileges for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 alphacas

# Copy all these files from the builder section up above, into the container
COPY --from=builder /app/public ./public
COPY --from=builder --chown=alphacas:nodejs /app/.next/standalone ./
COPY --from=builder --chown=alphacas:nodejs /app/.next/static ./.next/static

USER alphacas

EXPOSE 3000

ENV PORT 3000
ENV GITHUB_USERNAME eddiefahrenheit

# We cannot use yarn dev/next dev here because this project's run time is built efficiently to its most basic form
# Without all the dev tools that we get normally in development
CMD ["node", "server.js"]

# After creating your dockerhub account

# Run the following line to create the image for this file (including the period at the end, that is the argument)
# docker build --platform linux/amd64 -t <DockerhubUserName>/<NameOfYourChoosingForThisImage> .

# -t is short for tag, followed by what you want to tag/name your image
# --platform linux/amd64 is for our free-tier amazon linux x86 ec2 server platform
# may or may not be necessary to remove this tag for local dev, I think macs can run this platform anyways

# Run this line to run your image/create the container in your local dev environment
# docker run -p 3000:3000 <DockerhubUserName>/<NameOfYourChoosingForThisImage> 

# -p signifies port mapping

# You may need to log into docker locally at this point, run the following line
# docker login

# This line pushes the image onto dockerhub, so you can later pull it back down on our ec2 linux machine
# docker push <DockerhubUserName>/<NameOfYourChoosingForThisImage>

### Below are instructions for set up on your ec2 server

# Install docker on your linux machine, docker login, and pull the image with the following line
# docker pull <DockerhubUserName>/<NameOfYourChoosingForThisImage>

# docker run -p 3000:3000 <DockerhubUserName>/<NameOfYourChoosingForThisImage>
# add the flags -i, -t, -d if you want

