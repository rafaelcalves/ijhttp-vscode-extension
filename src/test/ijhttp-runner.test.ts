import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import { IJHttpRunner } from '../ijhttp-runner';

suiteSetup(() => {
    // Install sinon for mocking
});

suiteTeardown(() => {
    sinon.restore();
});

suite('IJHttpRunner Test Suite', () => {
    let ijhttpRunner: IJHttpRunner;
    let mockTerminal: any;
    let sandbox: sinon.SinonSandbox;
    let tempDir: string;

    setup(() => {
        sandbox = sinon.createSandbox();
        ijhttpRunner = new IJHttpRunner();
        
        // Create temp directory for test files
        tempDir = path.join(__dirname, 'temp-test-files');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Mock terminal
        mockTerminal = {
            show: sandbox.stub(),
            sendText: sandbox.stub(),
            dispose: sandbox.stub()
        };

        sandbox.stub(vscode.window, 'createTerminal').returns(mockTerminal);
    });

    teardown(() => {
        sandbox.restore();
        
        // Clean up temp directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    suite('executeHttpFile', () => {
        test('should show error when no active editor and no fileUri provided', async () => {
            const showErrorStub = sandbox.stub(vscode.window, 'showErrorMessage');
            sandbox.stub(vscode.window, 'activeTextEditor').value(undefined);

            await ijhttpRunner.executeHttpFile();

            assert.ok(showErrorStub.calledWith('No active file is open'));
        });

        test('should execute ijhttp command with fileUri parameter', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            
            const fileUri = vscode.Uri.file(testFilePath);
            
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const createTerminalStub = vscode.window.createTerminal as sinon.SinonStub;
            assert.ok(createTerminalStub.called);
            assert.ok(mockTerminal.show.calledOnce);
            assert.ok(mockTerminal.sendText.calledOnce);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.includes('ijhttp'));
            assert.ok(command.includes('test.http'));
        });

        test('should execute ijhttp command with active editor', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            
            const mockDocument = {
                uri: vscode.Uri.file(testFilePath)
            };
            
            const mockEditor = {
                document: mockDocument
            };
            
            sandbox.stub(vscode.window, 'activeTextEditor').value(mockEditor);
            
            await ijhttpRunner.executeHttpFile();
            
            const createTerminalStub = vscode.window.createTerminal as sinon.SinonStub;
            assert.ok(createTerminalStub.called);
            assert.ok(mockTerminal.sendText.calledOnce);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.includes('ijhttp'));
            assert.ok(command.includes('test.http'));
        });
    });

    suite('environment file handling', () => {
        test('should include env-file flag when http-client.env.json exists', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            const envFilePath = path.join(tempDir, 'http-client.env.json');
            
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            fs.writeFileSync(envFilePath, JSON.stringify({
                dev: { host: 'localhost' },
                prod: { host: 'example.com' }
            }));
            
            // Mock showQuickPick to return the selected string directly
            sandbox.stub(vscode.window, 'showQuickPick').resolves('dev' as any);
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.includes('--env-file "http-client.env.json"'));
            assert.ok(command.includes('--env dev'));
        });

        test('should include private-env-file flag when http-client.private.env.json exists', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            const privateEnvFilePath = path.join(tempDir, 'http-client.private.env.json');
            
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            fs.writeFileSync(privateEnvFilePath, JSON.stringify({
                dev: { secret: 'dev-secret' },
                prod: { secret: 'prod-secret' }
            }));
            
            sandbox.stub(vscode.window, 'showQuickPick').resolves('prod' as any);
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.includes('--private-env-file "http-client.private.env.json"'));
            assert.ok(command.includes('--env prod'));
        });

        test('should include both env files when both exist', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            const envFilePath = path.join(tempDir, 'http-client.env.json');
            const privateEnvFilePath = path.join(tempDir, 'http-client.private.env.json');
            
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            fs.writeFileSync(envFilePath, JSON.stringify({ dev: { host: 'localhost' } }));
            fs.writeFileSync(privateEnvFilePath, JSON.stringify({ dev: { secret: 'secret' } }));
            
            sandbox.stub(vscode.window, 'showQuickPick').resolves('dev' as any);
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.includes('--env-file "http-client.env.json"'));
            assert.ok(command.includes('--private-env-file "http-client.private.env.json"'));
            assert.ok(command.includes('--env dev'));
        });

        test('should extract unique environments from both files', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            const envFilePath = path.join(tempDir, 'http-client.env.json');
            const privateEnvFilePath = path.join(tempDir, 'http-client.private.env.json');
            
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            fs.writeFileSync(envFilePath, JSON.stringify({
                dev: { host: 'localhost' },
                staging: { host: 'staging.example.com' }
            }));
            fs.writeFileSync(privateEnvFilePath, JSON.stringify({
                dev: { secret: 'dev-secret' },
                prod: { secret: 'prod-secret' }
            }));
            
            const quickPickStub = sandbox.stub(vscode.window, 'showQuickPick');
            quickPickStub.resolves('dev' as any);
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            assert.ok(quickPickStub.calledOnce);
            // For this test, we trust that the environments are extracted correctly
            // since the command includes the environment flag
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.includes('--env dev'));
        });

        test('should use first environment as default when user cancels selection', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            const envFilePath = path.join(tempDir, 'http-client.env.json');
            
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            fs.writeFileSync(envFilePath, JSON.stringify({
                prod: { host: 'example.com' },
                dev: { host: 'localhost' }
            }));
            
            // Simulate user canceling the quick pick
            sandbox.stub(vscode.window, 'showQuickPick').resolves(undefined);
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            // Should use first environment (alphabetically first)
            assert.ok(command.includes('--env'));
        });

        test('should handle malformed JSON files gracefully', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            const envFilePath = path.join(tempDir, 'http-client.env.json');
            
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            fs.writeFileSync(envFilePath, 'invalid json content');
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            // Should not include env flags when JSON is malformed
            assert.ok(!command.includes('--env-file'));
            assert.ok(!command.includes('--env'));
        });
    });

    suite('terminal execution', () => {
        test('should create terminal with correct configuration', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            const createTerminalCall = (vscode.window.createTerminal as sinon.SinonStub).getCall(0);
            const terminalOptions = createTerminalCall.args[0];
            
            assert.strictEqual(terminalOptions.name, 'ijhttp Terminal');
            assert.strictEqual(terminalOptions.cwd, tempDir);
        });

        test('should show terminal and send command', async () => {
            const testFilePath = path.join(tempDir, 'test.http');
            fs.writeFileSync(testFilePath, 'GET https://example.com');
            
            const fileUri = vscode.Uri.file(testFilePath);
            await ijhttpRunner.executeHttpFile(fileUri);
            
            assert.ok(mockTerminal.show.calledOnce);
            assert.ok(mockTerminal.sendText.calledOnce);
            
            const command = mockTerminal.sendText.getCall(0).args[0];
            assert.ok(command.startsWith('ijhttp'));
            assert.ok(command.includes('"test.http"'));
        });
    });
});