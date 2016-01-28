"use strict";

const CONFIG_BLOCK = "jsCodeAssist";

const POSSIBLE_TARGETS = new Set([
    "endOfFile",
    "clipboard"
]);

const DEFAULT_TARGET = "endOfFile";

function Config(vscode) {

    function getTarget(commandName) {
        const config = vscode.workspace.getConfiguration(CONFIG_BLOCK);
        const commandTarget = config[commandName];

        return POSSIBLE_TARGETS.has(commandTarget) ? commandTarget : DEFAULT_TARGET;
    }

    return {
        getTarget
    };
}

module.exports = Config;
