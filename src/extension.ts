// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ijhttp-vscode-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const helloWorld = vscode.commands.registerCommand('ijhttp-vscode-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ijhttp-vscode-extension!');
	});

	const exec = vscode.commands.registerCommand('ijhttp-vscode-extension.exec', async (fileUri?: vscode.Uri) => {
		// The code you place here will be executed every time your command is executed
		// Get the target file - either from context menu or active editor
		let targetFileUri: vscode.Uri;
		let targetFileDir: string;
		let targetFileName: string;
		
		if (fileUri) {
			// Called from context menu
			targetFileUri = fileUri;
			targetFileDir = vscode.Uri.joinPath(targetFileUri, '..').fsPath;
			targetFileName = path.basename(targetFileUri.path);
		} else {
			// Called from command palette or keybinding - use active editor
			const activeEditor = vscode.window.activeTextEditor;
			if (!activeEditor) {
				vscode.window.showErrorMessage('No active file is open');
				return;
			}
			
			targetFileUri = activeEditor.document.uri;
			targetFileDir = vscode.Uri.joinPath(targetFileUri, '..').fsPath;
			targetFileName = path.basename(targetFileUri.path);
		}
		
		// Look for environment files
		const envFile = path.join(targetFileDir, 'http-client.env.json');
		const privateEnvFile = path.join(targetFileDir, 'http-client.private.env.json');
		
		// Build ijhttp command
		let command = 'ijhttp';
		
		// Add environment file if it exists
		if (fs.existsSync(envFile)) {
			command += ` --env-file "${path.basename(envFile)}"`;
		}
		
		// Add private environment file if it exists
		if (fs.existsSync(privateEnvFile)) {
			command += ` --private-env-file "${path.basename(privateEnvFile)}"`;
		}
		
		// Ask for environment name if env files exist
		if (fs.existsSync(envFile) || fs.existsSync(privateEnvFile)) {
			const envName = await vscode.window.showInputBox({
				prompt: 'Enter environment name (e.g., dev, prod)',
				placeHolder: 'dev'
			});
			
			if (envName) {
				command += ` --env ${envName}`;
			}
		}
		
		// Add the HTTP file
		command += ` "${targetFileName}"`;
		
		// Create or get terminal and run ijhttp command
		const terminal = vscode.window.createTerminal({
			name: 'ijhttp Terminal',
			cwd: targetFileDir
		});
		
		terminal.show();
		terminal.sendText(command);
	});

	context.subscriptions.push(helloWorld);
	context.subscriptions.push(exec);
}

// This method is called when your extension is deactivated
export function deactivate() {}
