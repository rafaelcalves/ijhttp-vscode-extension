# ijhttp VS Code Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Extension-blue)](https://marketplace.visualstudio.com/vscode)

> 🔥 **"I won't give up!"** - Channel your inner Saiyan determination while testing HTTP APIs!

Bring the power of JetBrains' **ijhttp** CLI tool directly into VS Code! This extension provides seamless integration for executing `.http` files with full environment support, making API testing as exciting as a Dragon Ball Z training session! 💪

## ✨ Features

### 🚀 Current Superpowers (v0.0.1)

- **✅ HTTP File Execution**: Right-click any `.http` file and execute it instantly
- **✅ Environment Detection**: Auto-discovers `http-client.env.json` and `http-client.private.env.json` files
- **✅ Interactive Environment Selection**: Choose your environment when multiple configurations are available
- **✅ Terminal Integration**: See real-time execution in VS Code's integrated terminal
- **✅ Context Menu Support**: Execute files directly from the Explorer panel
- **✅ Smart Working Directory**: Commands run in the correct file context

### 🔄 Training for New Transformations (Coming Soon!)

- [ ] **Individual Request Execution**: Power up single requests within a file
- [ ] **Syntax Highlighting**: Beautiful `.http` file syntax highlighting
- [ ] **IntelliSense Support**: Auto-completion for HTTP methods, headers, and more
- [ ] **Response Visualization**: Format and display HTTP responses beautifully
- [ ] **Request History**: Track and replay previous executions
- [ ] **Variable Support**: Enhanced variable resolution and management
- [ ] **Authentication Helpers**: OAuth, Basic Auth, and JWT assistants
- [ ] **Request Collections**: Organize your API tests like a true warrior
- [ ] **Export Capabilities**: Convert to cURL, Postman, and other formats

## 🛠 Requirements

This extension enhances your workflow but relies on the official **ijhttp CLI** tool for execution:

### Prerequisites

1. **ijhttp CLI** (Required)
   ```bash
   # Install via JetBrains Toolbox or download from:
   # https://www.jetbrains.com/help/idea/http-client-cli.html
   
   # Verify installation:
   ijhttp --version
   ```

2. **VS Code** version 1.107.0 or higher

### System Compatibility
- ✅ macOS
- ✅ Windows  
- ✅ Linux

## 🚀 Getting Started

### Installation

1. Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) (coming soon!)
2. Or install from VSIX:
   ```bash
   code --install-extension ijhttp-vscode-extension-0.0.1.vsix
   ```

### Usage

#### Method 1: Context Menu (Easiest!)
1. Right-click any `.http` file in the Explorer
2. Select **"Run with ijhttp"**
3. Choose your environment if prompted
4. Watch the magic happen in the terminal! ⚡️

#### Method 2: Command Palette
1. Open a `.http` file
2. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Run with ijhttp" and select the command
4. Select your environment and execute!

### Environment Files

The extension automatically detects JetBrains-style environment files:

```
your-project/
├── requests.http
├── http-client.env.json          # Public environment variables
└── http-client.private.env.json  # Private/sensitive variables (git-ignored)
```

**Example environment file structure:**
```json
{
  "dev": {
    "host": "localhost:3000",
    "token": "dev-token-123"
  },
  "staging": {
    "host": "staging.example.com", 
    "token": "staging-token-456"
  },
  "production": {
    "host": "api.example.com",
    "token": "prod-token-789"
  }
}
```

## 🎯 Architecture Philosophy

> **"Every line of code makes you stronger!"** 

This extension follows a **command-driven architecture** with these core principles:

- **🛡 External Tool Dependency**: We enhance UX but respect the ijhttp CLI as the ultimate technique
- **⚡️ Terminal Transparency**: All executions visible in integrated terminal  
- **🌍 Environment-Aware**: Full JetBrains environment file support
- **🔧 Command Pattern**: Clean separation between VS Code integration and execution logic
- **📁 Smart Resolution**: Automatic working directory and file resolution

## 🧪 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/rafaelcalves/ijhttp-vscode-extension.git
cd ijhttp-vscode-extension

# Install dependencies
npm install

# Compile TypeScript (CRITICAL!)
npm run compile

# Run tests
npm test

# Start development with file watching
npm run watch

# Package for distribution
npm run vscode:prepublish
```

### 🔥 Critical Development Rules

1. **ALWAYS compile before testing**: `npm run compile`
2. **Tests must pass**: `npm test` should be green ✅
3. **Linting is mandatory**: `npm run lint` must pass
4. **Follow the Saiyan Code**: Never give up, keep pushing forward! 💪

### Testing

Run the extension in Development Host:
1. Press `F5` or use "Run Extension" from VS Code
2. Test with files in `test-workspace/` directory
3. Verify environment detection and execution

## 📝 Commands

| Command | Description | Keyboard Shortcut |
|---------|-------------|-------------------|
| `ijhttp-vscode-extension.exec` | Execute HTTP file with ijhttp | *None (coming soon!)* |

## ⚙️ Extension Settings

Currently, this extension works out-of-the-box with no configuration needed! 🎉

*Future settings coming soon:*
- Custom ijhttp CLI path
- Default environment selection
- Response formatting preferences
- And much more!

## 🐛 Known Issues

- Individual request execution within files not yet implemented
- No syntax highlighting for `.http` files yet
- Response handling is currently terminal-only

> **Remember**: Every bug is just a new challenge to overcome! Keep training and these limitations will become strengths! 💪

## 🗺 Roadmap

### Version 0.1.0 - "Basic Kamehameha"
- ✅ File execution via context menu
- ✅ Environment file detection
- ✅ Terminal integration

### Version 0.2.0 - "Super Saiyan Transformation" 
- [ ] Individual request execution
- [ ] Basic syntax highlighting
- [ ] Response visualization

### Version 0.3.0 - "Ultra Instinct" 
- [ ] Advanced IntelliSense
- [ ] Request history
- [ ] Authentication helpers

### Version 1.0.0 - "Mastered Ultra Instinct"
- [ ] Full feature parity with JetBrains HTTP Client
- [ ] Performance optimizations
- [ ] Advanced debugging support

## 🤝 Contributing

**Channel that Saiyan spirit!** Contributions are welcome and encouraged!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-new-power`
3. Make your changes with that unstoppable determination
4. Run the tests: `npm test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/rafaelcalves/ijhttp-vscode-extension/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- **JetBrains** for creating the amazing ijhttp CLI tool
- **VS Code Team** for the incredible extension API
- **Akira Toriyama** for inspiring us to never give up and always push our limits! 🐉

---

> **"The limits are only in your mind! Keep pushing forward and unlock new levels of API testing power!"** 
> 
> *Remember: This extension makes you stronger, but the real power comes from the ijhttp technique itself!* ⚡️🔥

**Happy HTTP Testing!** 🚀
