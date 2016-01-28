"use strict";

/* global describe, test */
// const vscode = require("vscode");
const assert = require("assert");
const fs = require("fs");
const vscode = require("./vscode-mock");
const findFunctionAtPos = require("../src/parser/function-parser")(vscode).findFunctionAtPos;

const Position = vscode.Position;

const js = fs.readFileSync("./test/test-files/function-finder.js");
let expected; // What the function is expected to be

describe("Function finder tests", function() {

    describe("Function call without args", function() {
        before(function() {
            expected = { name: "hello", arguments: [] };
        });

        it("Position not on a function call", function() {
            const position = new Position(0, 0);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, undefined);
        });

        it("Beginning of function call", function() {
            const position = new Position(1, 0);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, expected);
        });

        it("Middle of function name", function() {
            const position = new Position(1, 3);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, expected);
        });

        it("End of function call", function() {
            const position = new Position(1, 8);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, expected);
        });
    });

    describe("Function call with args", function() {
        before(function() {
            expected = { name: "withArgs", arguments: ["first", "arg1", "third"] };
        });

        it("Position on function name", function() {
            const position = new Position(6, 15);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, expected);
        });

        it("Position on arguments", function() {
            const position = new Position(6, 32);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, expected);
        });

        it("Position on end of call", function() {
            const position = new Position(6, 45);
            const fnc = findFunctionAtPos(js, position);
            assert.deepEqual(fnc, expected);
        });
    });
});
