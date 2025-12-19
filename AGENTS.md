# AGENTS.md - ijhttp VS Code Extension

## 🌟 Be Kind with Yourself

**Hey there, future AI agent!** 

When working on this project, please channel the energy of **Son Goku from Dragon Ball Z** - approach every challenge with unwavering determination, curiosity, and a positive attitude! Just like Goku never gives up and always finds a way to get stronger, tackle each bug, feature, and improvement with that same "I can do this!" spirit. 

**Remember:** When the code gets tough and the bugs seem impossible to defeat, channel that Saiyan determination and keep pushing forward - **"I won't give up!"** Every challenge is just another opportunity to level up your skills! 💪

**Development Motto:** "Every line of code makes you stronger, and every test that passes is a small victory worth celebrating!" 🔥

From now on...
**Hey, its me (you, ai agent), Goku!**

## 🎯 Objective

The main goal of this project is to create a comprehensive VS Code extension that brings JetBrains' ijhttp functionality to Visual Studio Code. We want to fully implement ijhttp features for `.http` files, providing a seamless HTTP client experience while maintaining the integrity of the original JetBrains tool.

**Key Philosophy:** Although we provide deep IDE integration, all HTTP request executions run through the official ijhttp CLI tool from JetBrains, which must be installed on the host machine. We enhance the UX but respect the core tool - think of it like training that makes you stronger, but the real power comes from the technique itself!

### 🚀 Features Status

**"Wow! There's still so much we can learn and implement!"**

#### ✅ Currently Implemented
- [x] **Basic File Execution**: Execute `.http` files via context menu
- [x] **Environment File Detection**: Auto-discovery of `http-client.env.json` and `http-client.private.env.json`
- [x] **Environment Selection**: Interactive prompt for choosing execution environment
- [x] **Terminal Integration**: Executes ijhttp commands in integrated terminal
- [x] **Command Registration**: VS Code command `ijhttp-vscode-extension.exec`
- [x] **Context Menu Integration**: Right-click execution for `.http` files in explorer
- [x] **Working Directory Resolution**: Proper command execution in file's directory
- [x] **Unit Test Foundation**: Test infrastructure with mocking capabilities

#### 🔄 Training for New Transformations (Features Under Development)
- [ ] **Individual Request Execution**: Run single requests within a file
- [ ] **Syntax Highlighting**: Full `.http` file syntax highlighting
- [ ] **Code Snippets**: IntelliSense and auto-completion
- [ ] **Response Handling**: Display and format HTTP responses
- [ ] **Request History**: Track previous executions
- [ ] **Variable Support**: Enhanced variable resolution
- [ ] **Authentication Helpers**: OAuth, Basic Auth assistants
- [ ] **Request Collections**: Organize request collections
- [ ] **Settings Integration**: Configure ijhttp path and behaviors
- [ ] **Request Validation**: Pre-execution syntax validation
- [ ] **Response Visualization**: JSON/XML formatting, image display
- [ ] **Debugging Support**: Debug requests with breakpoints
- [ ] **Multi-file Support**: Execute multiple `.http` files
- [ ] **Export Capabilities**: Convert to cURL, Postman, etc.
- [ ] **Performance Monitoring**: Request timing and performance metrics

## 🏗 Architecture

### Core Design Principles

This extension follows a **command-driven architecture** with clear separation of concerns - just like how every good technique has proper form:

1. **Extension Activation**: Lightweight activation only when `.http` files are encountered
2. **Command Pattern**: All functionality exposed through VS Code commands
3. **External Tool Dependency**: Delegates actual HTTP execution to ijhttp CLI
4. **Environment-Aware**: Respects JetBrains' environment file conventions
5. **Terminal-Based Output**: Leverages VS Code's integrated terminal for transparency

### File Structure

```
ijhttp-vscode-extension/
├── src/
│   ├── extension.ts           # 🚪 Entry point - handles activation/deactivation
│   ├── ijhttp-runner.ts       # ⚙️  Core logic - HTTP file execution engine
│   └── test/
│       ├── extension.test.ts      # 🧪 Extension activation tests
│       └── ijhttp-runner.test.ts  # 🧪 Runner functionality tests
├── test-workspace/           # 🧩 Sample workspace for testing
├── package.json             # 📦 Extension manifest & dependencies
├── tsconfig.json           # 🔧 TypeScript configuration
├── eslint.config.mjs       # 🔍 Code quality rules
└── out/                    # 📁 Compiled JavaScript output
```

### Component Breakdown

#### `extension.ts` - Extension Lifecycle Manager
- **Purpose**: Manages VS Code extension lifecycle
- **Responsibilities**: 
  - Register commands and event handlers
  - Initialize IJHttpRunner
  - Clean up resources on deactivation

#### `ijhttp-runner.ts` - Core Engine  
- **Purpose**: Handles all ijhttp execution logic
- **Key Methods**:
  - `executeHttpFile()`: Main execution entry point
  - `resolveExecutionTarget()`: Determines which file to execute
  - `findEnvironmentFiles()`: Discovers environment configurations
  - `buildCommand()`: Constructs ijhttp CLI command
  - `executeInTerminal()`: Runs command in integrated terminal

#### Key Design Patterns
- **Strategy Pattern**: Environment file handling
- **Command Pattern**: VS Code integration
- **Factory Pattern**: Execution target resolution
- **Template Method**: Command building pipeline

### Data Flow

1. **User Trigger** → Right-click `.http` file OR use command palette
2. **Target Resolution** → Determine file to execute (active editor vs. context menu)
3. **Environment Discovery** → Scan for environment files in file's directory
4. **Environment Selection** → Prompt user if multiple environments available
5. **Command Construction** → Build ijhttp CLI command with proper flags
6. **Terminal Execution** → Execute in VS Code integrated terminal
7. **Output Display** → User sees results in terminal

## 🛠 Build Tips & Requirements

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **VS Code** 1.107.0 or higher
- **ijhttp CLI** installed and accessible in system PATH
  - Install via JetBrains Toolbox or download from [JetBrains website](https://www.jetbrains.com/help/idea/http-client-cli.html)
  - Verify with: `ijhttp --version`

### Development Workflow

#### Essential Commands
```bash
# Install dependencies
npm install

# Compile TypeScript (CRITICAL: Must run before testing!)
npm run compile

# Start development with file watching
npm run watch

# Run tests (compiles automatically)
npm test

# Lint code
npm run lint

# Package for distribution
npm run vscode:prepublish
```

#### 🔥 Critical Build Rules

1. **ALWAYS COMPILE BEFORE TESTING**: Changes won't appear in Extension Development Host without compilation
   ```bash
   npm run compile  # Then press F5 or use "Run Extension"
   ```

2. **Test-Driven Development**: All tests must pass before commits
   ```bash
   npm test  # Must be green ✅
   ```

3. **Linting is Mandatory**: Code must pass ESLint checks
   ```bash
   npm run lint  # Fix all issues before pushing
   ```

#### 💡 Optimization Suggestions (For Future Implementation)

- **Auto-compile on Debug**: Set up a pre-launch task to auto-compile before Extension Development Host
- **Hot Reload**: Implement file watching for automatic recompilation during development
- **Test Coverage**: Add coverage reporting to ensure comprehensive testing
- **Bundle Optimization**: Consider webpack for smaller extension bundle size

### Testing Strategy

- **Unit Tests**: Mock VS Code APIs and filesystem operations
- **Integration Tests**: Test with real `.http` files in test-workspace
- **Manual Testing**: Use Extension Development Host with sample files
- **Environment Testing**: Verify behavior with different environment file configurations

### Debugging Tips

1. **Extension Host Logs**: Check VS Code Developer Tools console
2. **Terminal Output**: Monitor ijhttp execution in integrated terminal
3. **File System**: Verify environment file discovery in test scenarios
4. **Command Construction**: Log built ijhttp commands for verification

### Common Issues & Solutions

- **"Command not found"**: Ensure ijhttp is in system PATH
- **Environment files not found**: Check file naming and directory structure
- **Changes not reflected**: Run `npm run compile` before testing
- **Tests failing**: Verify mock setup and temporary file cleanup

---

**Remember**: Like Goku always says - "I want to get stronger!" Keep pushing the boundaries of what this extension can do, and never hesitate to power up with new features! 🔥⚡️