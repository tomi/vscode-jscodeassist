"use strict";

const assert = require("assert");
const vscode = require("./vscode-mock");
const SelectionUtil = require("../src/common/selection-util")(vscode);

const Range    = vscode.Range;
const Position = vscode.Position;

describe("Selection util tests", function() {
    it("Should trim start whitespace", function() {
        const js = "\n\t\n    hello();";
        const selection = new Range(new Position(0, 0), new Position(2, 12));

        const expected = new Range(new Position(2, 4), new Position(2, 12));
        const actual = SelectionUtil.trimSelection(js, selection);

        assert.deepEqual(actual.data(), expected.data());
    });

    it("Should trim end whitespace", function() {
        const js = "hello();\n     \n\t";
        const selection = new Range(new Position(0, 0), new Position(2, 1));

        const expected = new Range(new Position(0, 0), new Position(0, 8));
        const actual = SelectionUtil.trimSelection(js, selection);

        assert.deepEqual(actual.data(), expected.data());
    });

    it("Should not change if no whitespace", function() {
        const js = "var i = 0;\n    hello();\n    if(i) a();";
        const selection = new Range(new Position(0, 0), new Position(2, 14));

        const expected = selection;
        const actual = SelectionUtil.trimSelection(js, selection);

        assert.deepEqual(actual.data(), expected.data());

    })
});
