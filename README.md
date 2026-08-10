<div align="center">
  <h1>🤖 Slack App Template</h1>
  <p><i>A structured, modular, and professional template for building robust <a href="https://slack.dev/bolt-js">Slack Bolt</a> apps in TypeScript.</i></p>
  
  <p>
    <a href="https://slack.dev/bolt-js"><img src="https://img.shields.io/badge/Slack_Bolt-v5-blue?style=for-the-badge&logo=slack" alt="Slack Bolt" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js" alt="Node.js" /></a>
  </p>
</div>

---

## 🧩 Where to Place Your Code

The template relies on file-based routing to keep your logic strictly organized:

- `src/configs/config.ts`: Define your app's static configurations, admin IDs, and global reply messages here.
- `src/commands/`: Place strict Slash Commands (`/command`) here.
- `src/actions/`: Place handlers for Block Kit interactivity (Button clicks, Select Menus) here.
- `src/views/`: Place strict handlers for Modal submissions and closed events here.
- `src/shortcuts/`: Place your Global and Message shortcuts here.
- `src/events/`: Place your standard Slack Events API listeners (like `app_mention`, `message`) here.

---

## ✨ Features

This template abstracts away the boilerplate of registering commands and strict middleware routing for the Slack API. 

- **Component Routing**: Supports granular, file-based routing for **Slash Commands**, **Actions**, **Views**, **Shortcuts**, and **Events**. Handlers automatically register themselves on boot without cluttering a central file.
- **Built-in Execution Guards**: Intercept commands globally before execution. Support for `adminOnly` enforcement and per-user `cooldown` rates natively baked in.
- **Socket Mode Default**: Pre-configured to use Socket Mode out of the box for frictionless local development without needing public HTTP endpoints.

> 📖 **[Read the Wiki](https://github.com/sea-deep/slack-app-template/wiki)** to learn how to create these commands and map your components.

---

## 🚀 Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- A Slack App configured at [api.slack.com/apps](https://api.slack.com/apps)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sea-deep/slack-app-template.git
   cd slack-app-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Copy the example environment file and update it with your credentials:
   ```bash
   cp .env.example .env
   ```
   > 🔑 *Open `.env` and insert your `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, and `SLACK_APP_TOKEN`.*

4. **Enable Socket Mode**
   Go to your App settings on Slack, navigate to **Socket Mode**, and toggle it on.

---

## 💻 Running the App

| Mode | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs the app with `ts-node`. |
| **Production** | `npm run build && npm start` | Compiles the TypeScript to `dist/` and starts the Node process. |

---

## 📁 Detailed Project Structure

```text
slack-app-template/
├── src/
│   ├── configs/           # Centralized configuration (config.ts)
│   ├── structures/        # TypeScript interfaces (Command, Event, Action, View, Shortcut)
│   ├── utilities/         # Core engine tools (env, logger, pathResolver, guards)
│   ├── loaders/           # Loaders that dynamically register components to Bolt
│   ├── commands/          # ➔ Your Slash Commands
│   ├── events/            # ➔ Your Slack Events API Listeners
│   ├── actions/           # ➔ Your Block Kit Actions
│   ├── views/             # ➔ Your Modal Views
│   ├── shortcuts/         # ➔ Your Shortcuts
│   └── app.ts             # Main entry point (registers loaders & launches app)
├── .env.example           # Environment template
└── package.json           # Dependencies and scripts
```

---

## 🤝 Contributing, Issues, & Discussions

We welcome all contributions! If you have a question, want to suggest a feature, or found a bug:
- **Discussions**: Have an idea or need help? Start a thread in our [Discussions](#) tab.
- **Issues**: Found a bug? Open an [Issue](#) with reproducible steps.
- **Contributing**: Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on submitting Pull Requests.

---

## 📚 Documentation

> [!IMPORTANT]  
> Detailed technical guides, including a comprehensive **Beginner's Getting Started Guide**, can be found in the **[GitHub Wiki](https://github.com/sea-deep/slack-app-template/wiki)**.

---

## 📄 License

This project is licensed under the [GPL-3.0 License](./LICENSE).
