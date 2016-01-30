"use strict";

const esprima = require("esprima");
const traverse = require("ast-traverse");

const globals = new Set(["Array", "Date", "Math", "Number", "Object",
    "String", "RegExp", "Boolean", "Set", "document", "window", "undefined"]);

function FunctionParser(vscode) {
    const Range    = vscode.Range;
    const Position = vscode.Position;

    function findArguments(js) {
        let defined    = new Set();
        let referenced = new Set();
        const ast = esprima.parse(js);
        const ignore = new Set(["property", "callee", "key"]);

        traverse(ast, {
            pre: function(node, parent, prop, idx) {
                if (node.type === "VariableDeclarator") {
                    defined.add(node.id.name);
                } else if (node.type === "Identifier" && !ignore.has(prop) &&
                    !globals.has(node.name) && !defined.has(node.name)) {
                    referenced.add(node.name);
                }
            }
        });

        return referenced;
    }

    function positionInNodeRange(node, position) {
        const nodeStart = node.loc.start;
        const nodeEnd   = node.loc.end;
        // esprima lines are 1-indexed, vscode 0-indexed
        const range = new Range(
            new Position(nodeStart.line - 1, nodeStart.column),
            new Position(nodeEnd.line - 1, nodeEnd.column + 1)); // Include possible ;

        return range.contains(position);
    }

    function findFunctionAtPos(js, cursorPos) {
        const ast = esprima.parse(js, { loc: true });
        let foundNode;

        traverse(ast, {
            pre: function(node) {
                if (node.type === "CallExpression" &&
                    positionInNodeRange(node, cursorPos)) {
                        foundNode = node;
                    }
            }
        });

        if (foundNode) {
            return {
                name: foundNode.callee.name,
                arguments: foundNode.arguments.map((arg, i) => arg.name || "arg" + i)
            };
        } else {
            return undefined;
        }
    }

    return {
        findArguments,
        findFunctionAtPos
    };
}

module.exports = FunctionParser;
