"use strict";

const assert = require("assert");
const vscode = require("./vscode-mock");
const JsBuilder = require("../src/common/js-builder")(vscode);
const LF = "\n";

describe("Function builder tests", function() {
    it("Function with no args", function() {
        const fnc = {
            name: "hello",
            arguments: []
        };

        const expected = `function hello() {${LF}${LF}}`;
        const actual = JsBuilder.functionDef(fnc);

        assert.equal(actual, expected);
    });

    it("Function with args", function() {
        const fnc = {
            name: "hello",
            arguments: ["first", "second"]
        };

        const expected = `function hello(first, second) {${LF}${LF}}`;
        const actual = JsBuilder.functionDef(fnc);

        assert.equal(actual, expected);
    });

    it("Function with body", function() {
        const fnc = {
            name: "hello",
            arguments: [],
            body: "var i = 0;"
        };

        const expected = `function hello() {${LF}    var i = 0;${LF}}`;
        const actual = JsBuilder.functionDef(fnc);

        assert.equal(actual, expected);
    });
});