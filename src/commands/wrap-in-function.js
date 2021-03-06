"use strict";

const vscode        = require("vscode");
const JsBuilder     = require("../common/js-builder")(vscode);
const SelectionUtil = require("../common/selection-util")(vscode);
const TextEdit      = require("../common/text-edit");

const NAME = "wrapInFunction";

function addFunctionToDocument(editor, selection, func) {
    editor.edit(editBuilder => {
        editBuilder.replace(selection, func)
    });
}

function createMethod() {
    try {
        return vscode.window.showInputBox({
            prompt: "Give function a name",
        }).then(funcName => {
            if (funcName === void 0) {
                return;
            }

            const editor    = vscode.window.activeTextEditor;
            const document  = editor.document;
            const selection = SelectionUtil.expandSelection(document, editor.selection);
            const text      = SelectionUtil.selectionAsLines(document, selection);
            const indent    = TextEdit.getMinIndent(text);
            const body      = TextEdit.removeIndent(text, indent);
            const functionStr = JsBuilder.functionDef({
                name: funcName,
                args: [],
                body: body
            });

            const indented = TextEdit.indent(functionStr, indent);
            addFunctionToDocument(editor, selection, indented);

            const newSelection = SelectionUtil.selectLines(document, selection.start.line, body.length + 2);
            editor.selection = newSelection;
        });
    } catch (x) {
        console.log(x);
    }
}

module.exports = {
    name: NAME,
    execute: createMethod
};
