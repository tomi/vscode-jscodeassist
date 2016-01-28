"use strict";

function SelectionUtil(vscode) {
    const Position = vscode.Position;
    const Range    = vscode.Range;

    function numNewLines(text) {
        return (text.match(/\r\n|\r|\n/g) || []).length;
    }

    /**
     * Returns a new range with all whitespace removed
     * from beginning and end of given selection
     */
    function trimSelection(text, selection) {
        const startWhitespace = (text.match(/^[\s\uFEFF\xA0]+/g) || [""])[0];
        const endWhitespace = (text.match(/[\s\uFEFF\xA0]+$/g) || [""])[0];

        const newLinesInStart = numNewLines(startWhitespace);
        const newLinesInEnd = numNewLines(endWhitespace);

        const indentInStart = (startWhitespace.match(/[\t ]+$/g) || [""])[0].length;
        const numEndWhitespace = endWhitespace.length;
        const startOfLastLine = Math.max(
            text.lastIndexOf("\n", text.length - numEndWhitespace - 1),
            text.lastIndexOf("\r", text.length - numEndWhitespace - 1)) + 1;
        const lastLineLength = text.length - startOfLastLine - numEndWhitespace;

        const startPosition = new Position(selection.start.line + newLinesInStart, indentInStart);
        const endPosition   = new Position(selection.end.line - newLinesInEnd, lastLineLength);
        return new Range(startPosition, endPosition);
    }

    /**
     * Expands given selection to cover all text on selected lines
     */
    function expandSelection(document, selection) {
        const range = new Range(
            selection.start.line, 0,
            selection.end.line, Number.MAX_SAFE_INTEGER
        )

        return document.validateRange(range);
    }

    /**
     * Returns selected text from given editor as an array of lines
     */
    function selectionAsLines(document, selection) {
        const text = document.getText(selection);

        return text.match(/[^\r\n]+/g);
    }

    return {
        trimSelection,
        selectionAsLines,
        expandSelection
    };
}

module.exports = SelectionUtil;
