import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ExecutionTarget {
    uri: vscode.Uri;
    directory: string;
    fileName: string;
}

interface EnvironmentFiles {
    public: string | null;
    private: string | null;
}

export class IJHttpRunner {
    private static readonly ENV_FILE_NAME = 'http-client.env.json';
    private static readonly PRIVATE_ENV_FILE_NAME = 'http-client.private.env.json';
    private static readonly TERMINAL_NAME = 'ijhttp Terminal';

    async executeHttpFile(fileUri?: vscode.Uri): Promise<void> {
        const target = await this.resolveExecutionTarget(fileUri);
        if (!target) return;

        const environmentFiles = this.findEnvironmentFiles(target.directory);
        const environmentName = await this.promptForEnvironmentName(environmentFiles);
        
        const command = this.buildCommand(target.fileName, environmentFiles, environmentName);
        this.executeInTerminal(command, target.directory);
    }

    private async resolveExecutionTarget(fileUri?: vscode.Uri): Promise<ExecutionTarget | null> {
        if (fileUri) {
            return this.createTargetFromUri(fileUri);
        }

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active file is open');
            return null;
        }

        return this.createTargetFromUri(activeEditor.document.uri);
    }

    private createTargetFromUri(uri: vscode.Uri): ExecutionTarget {
        return {
            uri,
            directory: vscode.Uri.joinPath(uri, '..').fsPath,
            fileName: path.basename(uri.path)
        };
    }

    private findEnvironmentFiles(directory: string): EnvironmentFiles {
        const publicEnvPath = path.join(directory, IJHttpRunner.ENV_FILE_NAME);
        const privateEnvPath = path.join(directory, IJHttpRunner.PRIVATE_ENV_FILE_NAME);

        return {
            public: fs.existsSync(publicEnvPath) ? IJHttpRunner.ENV_FILE_NAME : null,
            private: fs.existsSync(privateEnvPath) ? IJHttpRunner.PRIVATE_ENV_FILE_NAME : null
        };
    }

    private async promptForEnvironmentName(environmentFiles: EnvironmentFiles): Promise<string | null> {
        if (!environmentFiles.public && !environmentFiles.private) {
            return null;
        }

        return await vscode.window.showInputBox({
            prompt: 'Enter environment name (e.g., dev, prod)',
            placeHolder: 'dev'
        }) || null;
    }

    private buildCommand(fileName: string, environmentFiles: EnvironmentFiles, environmentName: string | null): string {
        const parts = ['ijhttp'];

        if (environmentFiles.public) {
            parts.push(`--env-file "${environmentFiles.public}"`);
        }

        if (environmentFiles.private) {
            parts.push(`--private-env-file "${environmentFiles.private}"`);
        }

        if (environmentName && (environmentFiles.public || environmentFiles.private)) {
            parts.push(`--env ${environmentName}`);
        }

        parts.push(`"${fileName}"`);
        
        return parts.join(' ');
    }

    private executeInTerminal(command: string, workingDirectory: string): void {
        const terminal = vscode.window.createTerminal({
            name: IJHttpRunner.TERMINAL_NAME,
            cwd: workingDirectory
        });

        terminal.show();
        terminal.sendText(command);
    }
}