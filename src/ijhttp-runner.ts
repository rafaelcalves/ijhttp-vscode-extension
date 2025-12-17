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
        const environmentName = await this.promptForEnvironmentName(environmentFiles, target.directory);
        
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

    private async promptForEnvironmentName(environmentFiles: EnvironmentFiles, directory: string): Promise<string | null> {
        if (!environmentFiles.public && !environmentFiles.private) {
            return null;
        }

        const availableEnvironments = this.extractAvailableEnvironments(environmentFiles, directory);
        if (availableEnvironments.length === 0) {
            return null;
        }

        const selectedEnvironment = await vscode.window.showQuickPick(availableEnvironments, {
            placeHolder: 'Select environment',
            canPickMany: false
        });

        return selectedEnvironment || availableEnvironments[0];
    }

    private extractAvailableEnvironments(environmentFiles: EnvironmentFiles, directory: string): string[] {
        const environments = new Set<string>();

        if (environmentFiles.public) {
            const publicEnvs = this.readEnvironmentsFromFile(path.join(directory, environmentFiles.public));
            publicEnvs.forEach(env => environments.add(env));
        }

        if (environmentFiles.private) {
            const privateEnvs = this.readEnvironmentsFromFile(path.join(directory, environmentFiles.private));
            privateEnvs.forEach(env => environments.add(env));
        }

        return Array.from(environments);
    }

    private readEnvironmentsFromFile(filePath: string): string[] {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const envData = JSON.parse(fileContent);
            return Object.keys(envData);
        } catch (error) {
            return [];
        }
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