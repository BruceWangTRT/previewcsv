'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as readline from 'readline';
const DEFAULT_LINES_TO_PREVIEW = 4;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.previewCsv', (uri) => {
        // The code you place here will be executed every time your command is executed

        // Get number of lines to preview from configuration.
        // Fallback to DEFAULT_LINES_TO_PREVIEW in case of failure.
        let linesToPreview = vscode.workspace.getConfiguration("previewcsv").get("linesToPreview")
                            || DEFAULT_LINES_TO_PREVIEW;

        // Display a message box to the user
        vscode.window.showInformationMessage(`Previewing first ${linesToPreview} lines of ${uri.path}`);

        // Open the selected file and read line by line
        let i = 0;
        let previewContent = '';
        let csvStream = fs.createReadStream(uri.path);
        let rl = readline.createInterface(csvStream);
        rl.on('line', (line) => {
            if(i >= linesToPreview) 
            { 
                rl.close(); 
                return;
            }
            previewContent = previewContent.concat(line, '\n');
            i++;
        }).on('close', ()=> {
            csvStream.close();
            // remove the last '\n'
            previewContent = previewContent.slice(0, -1);
            // Prepare a TextDocument and show it in a new tab
            vscode.workspace.openTextDocument({language: 'CSV', content: previewContent})
                .then(doc => vscode.window.showTextDocument(doc, {preview: false}));
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}