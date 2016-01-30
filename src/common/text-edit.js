"use strict";

/**
 * Returns minimum line indentation on given text or lines of text,
 * ignoring the first line unless it's the only line
 */
function getMinIndent(text) {
    const indents = Array.isArray(text) ?
        text.map(line => (line.match(/^\s+/) || [""])[0]) :
        text.match(/^\s*/gm);

    if (indents === null || indents.length === 0) {
        return "";
    } else if (indents.length === 1) {
        return indents[0];
    } else {
        return indents.reduce((prev, curr, idx) => {
            if (idx === 0) { // Ignore first line
                return prev;
            } else if (prev === null) {
                return curr;
            } else {
                return curr.length < prev.length ? curr : prev;
            }
        }, null);
    }
}

/**
 * Removes indent that all lines have from text
 */
function removeIndent(lines, indent) {
    const regex = new RegExp(`^${ indent.replace("\t", "\\t") }`);

    return lines.map(line => line.replace(regex, ""));
}

/**
 * Indents given text or lines of text by default indent.
 */
function indent(text, indent) {
    const addIndent = line => indent + line;

    if (Array.isArray(text)) {
        return text.map(addIndent);
    } else {
        const lines = text.match(/[^\r\n]+/g) || [];

        return lines.map(addIndent).join("\n");
    }
}

const TextEdit = {
    getMinIndent,
    removeIndent,
    indent
};

module.exports = TextEdit;
