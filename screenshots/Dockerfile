# The screenshot runner: Playwright with its browser, and the scripts and photos baked in.
FROM mcr.microsoft.com/playwright:v1.62.1-noble
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY src src
COPY assets assets
ENTRYPOINT ["node", "src/take-screenshots.mjs"]
