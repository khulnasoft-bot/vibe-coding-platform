# Vibe Coding Platform

A modern, open-source platform for AI-assisted coding with live preview, built on Next.js 16, Vercel AI SDK, and Vercel Sandbox.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required: Vercel AI Gateway API Key
# Get yours at https://vercel.com/products/ai
AIGATEWAY_API_KEY=your-aigateway-api-key

# Optional: JWT Secret for sandbox authentication
# Automatically generated if not provided
SANDBOX_JWT_SECRET=your-jwt-secret

# Optional: Vercel Sandbox API URL
# Only needed if using a custom sandbox deployment
SANDBOX_URL=https://sandbox.vercel.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Multi-Model AI Support**: Claude, GPT, Grok via Vercel AI Gateway
- **Secure Sandboxed Execution**: Ephemeral app execution with Vercel Sandbox
- **Live Preview**: See your app running in real-time
- **AI Tool Orchestration**: Create sandboxes, generate files, run commands
- **Streaming Responses**: Real-time AI responses with reasoning metadata
- **File Explorer**: Browse sandbox filesystem with search
- **Command Logs**: Monitor execution logs and errors
- **Session Persistence**: Recover your sandbox session
- **Onboarding Tour**: Guided introduction to the workspace
- **Rate Limiting**: Protection against abuse

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=A+full-stack+coding+platform+built+with+Vercel%27s+AI+Cloud%2C+AI+SDK%2C+and+Next.js.&demo-image=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1754588832%2FOSSvibecodingplatform%2Fscreenshot.png&demo-title=Vibe+Coding+Platform&demo-url=https%3A%2F%2Fvercel.fyi%2Fvibes&project-name=Vibe+Coding+Platform&repository-name=vibe-coding-platform&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fapps%2Fvibe-coding-platform&from=vibe-coding-platform-app)

Or deploy manually:

```bash
npm run build
npm run start
```

## Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## CI/CD

This project uses GitHub Actions for:
- Linting (`npm run lint`)
- Type checking (`npm run type-check`)
- Running tests (`npm test`)

## License

MIT
