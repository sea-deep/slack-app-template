# Slack App Template

A production-grade, highly scalable Slack App Template built with TypeScript and `@slack/bolt`. It features a dynamic file-based routing architecture that keeps your main `app.ts` file perfectly clean.

## 🚀 Quickstart

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd slack-app-template
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the project and add your Slack credentials:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token
   PORT=3000
   ```

## 🏃 Running the App

To run the application in development mode with Socket Mode enabled:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm start
```

## 🧩 Where to Place Your Code

The template relies on an automatic file-loader routing engine. To add new features, simply create a new file in the respective folder inside `src/`. Do not edit `app.ts`.

- **Slash Commands** (`app.command()`): Place inside `src/commands/`
- **Events** (`app.event()`): Place inside `src/events/`
- **Block Kit Actions** (`app.action()`): Place inside `src/actions/`
- **Modal Views** (`app.view()`): Place inside `src/views/`
- **Shortcuts** (`app.shortcut()`): Place inside `src/shortcuts/`

Each file must use the `export default` syntax with the provided interface shapes. See the included examples like `src/commands/ping.ts` to get started!
