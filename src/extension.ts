import * as vscode from 'vscode';
import { IJHttpRunner } from './ijhttp-runner';

export function activate(context: vscode.ExtensionContext) {
	const ijhttpRunner = new IJHttpRunner();

	const executeCommand = vscode.commands.registerCommand(
		'ijhttp-vscode-extension.exec',
		(fileUri?: vscode.Uri) => ijhttpRunner.executeHttpFile(fileUri)
	);

	context.subscriptions.push(executeCommand);
}

export function deactivate() {}
