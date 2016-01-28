"use strict";

const vscode = require('vscode');
const createFunction = require("./commands/create-function");
const extractMethod = require("./commands/extract-function");
const wrapInFunction = require("./commands/wrap-in-function");

const commands = [
    createFunction,
    extractMethod,
    wrapInFunction
];

const extensionPrefix = "jsCodeAssist";

const createCommand = (name) => [{
    title:   "Create function",
    command: "jsCodeAssist.createFunction"
}];

const code = "2304";

const codeActionFactory = {
    provideCodeActions: function(document, range, context, token) {
        if (context.diagnostics.length === 0 ||
            context.diagnostics[0].code !== code) {
            return [];
        }

        const text = document.getText(range);

        // return createCommand(text);
        // return [{ title: text, command: "extension.testShit" }];
        return [{ title: text, command: "jsCodeAssist.createFunction" }];
    }
};

function activate(context) {
    commands.forEach(cmd => {
        const name = `${extensionPrefix}.${cmd.name}`;
        const disposable = vscode.commands.registerCommand(
            name, cmd.execute
        );

        context.subscriptions.push(disposable);
    });

    const fixer = vscode.languages.registerCodeActionsProvider(
        "javascript", codeActionFactory);

	context.subscriptions.push(fixer);
}

// this method is called when your extension is deactivated
function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;
