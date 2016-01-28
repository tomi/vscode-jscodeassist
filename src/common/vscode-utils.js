"use strict";

const vscode    = require("vscode");
const Clipboard = require("copy-paste");
const Config    = require("../common/config")(vscode);

function getEndPosition(document) {
    const infinityPosition = new vscode.Position(
        Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

    return document.validatePosition(infinityPosition);
}

function addToConfiguredTarget(name, editor, text) {
    const target = Config.getTarget(name);

    if (target === "clipboard") {
        copyToClipboard(text);
    } else {
        addToEndOfFile(editor, text);
    }
}

function copyToClipboard(text) {
    Clipboard.copy(text);

    vscode.window.showInformationMessage("Copied to clipboard");
}

function addToEndOfFile(editor, text) {
    const LF = "\n";
    const endOfFile = getEndPosition(editor.document);

    editor.edit(editBuilder => {
        editBuilder.insert(endOfFile, `${LF}${text}`);
    });
}

module.exports = {
    getEndPosition,
    addToConfiguredTarget
};
