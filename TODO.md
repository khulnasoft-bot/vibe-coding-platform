# Vibe Coding Platform - Improvement TODO

> Generated from project review on 2026-05-02

## High Priority

### 1. Stabilize Sandbox Lifecycle
- [x] Add explicit sandbox session state management
- [x] Implement reset/recreate controls for users
- [x] Persist sandbox ID and current app state safely for session recovery
- **Files**: `app/api/chat/route.ts`, `ai/tools/create-sandbox.ts`, `app/page.tsx`

### 2. Harden AI Workflow and Error Handling
- [x] Expand tool error handling for file generation, command execution, sandbox creation
- [x] Surface meaningful error messages to the UI
- [x] Add retry/fallback flows for invalid AI tool responses
- **Files**: `ai/tools/*.ts`, `app/api/chat/route.ts`

### 3. Improve Security
- [x] Validate all sandbox inputs and tool requests on the server
- [x] Add rate limiting beyond `checkBotId`
- [x] Ensure generated code never escapes the sandbox or uses unsafe paths
- **Files**: `app/api/chat/route.ts`, `ai/tools/*.ts`

### 4. Add Tests and CI
- [x] End-to-end tests for chat API
- [x] Tests for sandbox tool behavior
- [x] Tests for UI flows
- [x] Automated lint/type-check in CI pipeline
- **Files**: New `tests/` directory, `.github/workflows/`

---

## Medium Priority

### 5. Improve Developer and User UX
- [x] Add onboarding tooltips for workspace panels and chat actions
- [x] Expose model selection in UI more clearly
- [x] Show reasoning effort controls
- [x] Make sandbox port settings visible/configurable
- **Files**: `app/page.tsx`, `components/`

### 6. Add Richer Preview and Git-like Diffs
- [ ] Show generated file diffs before writing to sandbox
- [ ] Add "preview changes" controls
- [ ] Add "accept/reject" controls for generated code
- **Files**: `components/`, `ai/tools/generate-files.ts`

### 7. Enhance File Explorer Functionality
- [ ] Support in-place file editing
- [x] Add file search within explorer
- [ ] Add directory context menus
- [x] Add syntax-aware code viewing
- [ ] Add tabbed file navigation
- **Files**: `components/file-explorer/`

### 8. Increase Observability
- [x] Correlate logs, command IDs, and sandbox errors in UI
- [x] Add structured error summary panel
- [x] Make error file links clickable
- **Files**: `components/command-logs.tsx`, `components/error-monitor.tsx`

---

## Low Priority

### 9. Expand AI/Tooling Capabilities
- [ ] Add support for additional provider models
- [ ] Add Azure/OpenAI endpoint support
- [ ] Improve tool prompts for self-diagnosis of sandbox failures
- **Files**: `ai/constants.ts`, `app/api/models/route.tsx`, `ai/prompts.ts`

### 10. Polish Production Readiness
- [ ] Add environment variable documentation
- [ ] Add deployment guidance
- [ ] Optimize bundle size for large sandbox states
- [ ] Add accessibility improvements for workspace UI
- **Files**: `README.md`, `app/page.tsx`, general accessibility audit

---

## Project Context

**Stack**: Next.js 16, Turbopack, AI SDK v6, Tailwind v4, React 19, Vercel Sandbox, Vercel AI Gateway

**Core Files**:
- `app/page.tsx` - Main workspace layout
- `app/api/chat/route.ts` - Chat API with model validation
- `app/api/models/route.tsx` - Model exposure endpoint
- `ai/tools/*.ts` - Sandbox orchestration tools
- `ai/constants.ts` - AI configuration
- `components/` - UI components

## Latest Relevant Features

1. Multi-model AI support via Vercel AI Gateway: Claude, GPT, Grok.
2. Secure ephemeral app execution using Vercel Sandbox.
3. Live app preview inside the workspace UI.
4. AI-controlled tool orchestration: create sandbox, generate files, run commands, get sandbox URLs.
5. Streaming chat responses with reasoning metadata and progress.
6. Remote sandbox file explorer backed by real sandbox filesystem APIs.
7. Command logs and structured error reporting for sandbox actions.
8. Responsive multi-panel layout with mobile tabbed view.
9. Model reasoning effort controls to tune output quality.
10. One-click Vercel deployment path and modern Next.js + AI SDK stack.
