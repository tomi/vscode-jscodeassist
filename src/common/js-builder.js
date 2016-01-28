"use strict";

const TextEdit = require("./text-edit");

function JsBuilder(vscode) {
    /**
     * Returns given editors default indent as string
     */
    function getEditorIndent() {
        const editor = vscode.window.activeTextEditor;

        return editor.options.insertSpaces ?
            " ".repeat(editor.options.tabSize) :
            "\t";
    }

    function functionDef(func) {
        const args = func.arguments ? func.arguments.join(", ") : "";
        const indent = getEditorIndent();
        let body = TextEdit.indent(func.body || "", indent);

        if (Array.isArray(body)) {
            body = body.join("\n");
        }

        return `function ${ func.name }(${ args }) {
${ body }
}`;
    }

    function functionCall(name, args) {
        const argsStr = args ? args.join(", ") : "";

        return `${name}(${argsStr});`;
    }

    return {
        functionDef,
        functionCall
    };
}

module.exports = JsBuilder;
