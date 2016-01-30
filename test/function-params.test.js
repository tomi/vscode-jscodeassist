"use strict";

const assert = require("assert");
const vscode = require("./vscode-mock");
const findArguments = require("../src/parser/function-parser")(vscode).findArguments;
const LF = "\n";

function assertSetEqual(first, second) {
    const firstArray = Array.from(first);
    const secondArray = Array.from(second);

    firstArray.sort();
    secondArray.sort();

    assert.deepEqual(firstArray, secondArray);
}

describe("Function params tests", function() {
    it("No variables", function() {
        const js = `var i = 0; hello();`;
        const expected = new Set();
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });

    it("Variable in function call", function() {
        const js = `Math.max(k, 10);`;
        const expected = new Set(["k"]);
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });

    it("Unknown object and assignment", function() {
        const js = `obj.property = a;`;
        const expected = new Set(["obj", "a"]);
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });

    it("Reserved objects", function() {
        const js = `obj.property = a;`;
        const expected = new Set(["obj", "a"]);
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });

    it("this keyword", function() {
        const js = `this.prop = "Money";`;
        const expected = new Set();
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });

    it("reserved words", function() {
        const js = `
var arr = [new Boolean(1),new String("str"),new Number(2),{}];
var obj = {};
Array.prototype.slice(arr, 2);
Object.keys(obj)
`;
        const expected = new Set();
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });

    it("object literals", function() {
        const js = `
var obj = {a: 10, "b": 20, c: variable };
`;
        const expected = new Set(["variable"]);
        const actual = findArguments(js);

        assertSetEqual(actual, expected);
    });
});
