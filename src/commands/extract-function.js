"use strict";

const vscode        = require("vscode");
const Copy          = require("copy-paste");
const CodeUtils     = require("../common/vscode-utils");
const JsBuilder     = require("../common/js-builder")(vscode);
const SelectionUtil = require("../common/selection-util")(vscode);
const TextEdit      = require("../common/text-edit");
const findArguments = require("../parser/function-parser")(vscode).findArguments;

const NAME = "extractFunction";

function doEdit(selection, functionDef, functionCall) {
    const editor    = vscode.window.activeTextEditor;
    const endOfFile = CodeUtils.getEndPosition(editor.document);
    const LF = "\n";

    if (selection.contains(endOfFile)) {
        // End of file is also selected. Edit zones can't overlap.
        editor.edit(editBuilder => {
            editBuilder.replace(selection, functionCall + `${LF}${LF}${functionDef}`);
        });
    } else {
        editor.edit(editBuilder => {
            editBuilder.replace(selection, functionCall);
            editBuilder.insert(endOfFile, `${LF}${LF}${functionDef}`);
        });
    }

    Copy.copy(functionDef);
}

function extractMethod() {
    return vscode.window.showInputBox({
        prompt: "Give function a name",
    }).then(funcName => {
        if (funcName === void 0) {
            return;
        }

        const editor      = vscode.window.activeTextEditor;
        const text        = editor.document.getText(editor.selection);
        const args        = Array.from(findArguments(text));

        const selection   = SelectionUtil.trimSelection(text, editor.selection);
        const lines       = SelectionUtil.selectionAsLines(editor.document, selection);
        const indent      = TextEdit.getMinIndent(lines);
        const body        = TextEdit.removeIndent(lines, indent);

        const functionDef = JsBuilder.functionDef({
            name:      funcName,
            arguments: args,
            body:      body,
        });

        const functionCall = TextEdit.indent(
            JsBuilder.functionCall(funcName, args),
            indent);

        doEdit(selection, functionDef, functionCall);
    }, err => console.log(err));
}

module.exports = {
    name: NAME,
    execute: extractMethod
};
