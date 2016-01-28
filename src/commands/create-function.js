"use strict";

const vscode            = require("vscode");
const findFunctionAtPos = require("../parser/function-parser")(vscode).findFunctionAtPos;
const JsBuilder         = require("../common/js-builder")(vscode);
const CodeUtils         = require("../common/vscode-utils");

const NAME = "createFunction";

function createMethod() {
    try {
        const editor      = vscode.window.activeTextEditor;
        const cursorPos   = editor.selection.active;
        const fileContent = editor.document.getText();
        const func        = findFunctionAtPos(fileContent, cursorPos);

        if (!func) {
            return vscode.window.showErrorMessage("Could not find a function call");
        }

        const funcString = JsBuilder.functionDef(func);
        CodeUtils.addToConfiguredTarget(NAME, editor, funcString);
    } catch (x) {
        console.log(x);
    }
}

module.exports = {
    name: NAME,
    execute: createMethod
};
