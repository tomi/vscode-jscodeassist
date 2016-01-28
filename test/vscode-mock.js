"use strict";

module.exports = {
    Position: function(line, column) {
        this.line = line;
        this.character = column;
    },

    Range: function(start, end) {
        this.start = start;
        this.end = end;

        this.contains = function(position) {
            if (position.line < this.start.line || position.line > this.end.line) {
                return false;
            }
            if (position.line === this.start.line && position.character < this.start.character) {
                return false;
            }
            if (position.line === this.end.line && position.character > this.end.character) {
                return false;
            }
            return true;
        };

        this.data = () => ({ start: this.start, end: this.end });
    },

    window: {
        activeTextEditor: {
            options: {
                insertSpaces: true,
                tabSize: 4
            }
        }
    }
};
