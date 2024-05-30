
import {inputRules, smartQuotes, emDash, ellipsis} from "prosemirror-inputrules"
import {Schema} from "prosemirror-model";
import {CustomInputRules as rule} from "./input-rules.ts";
import {keymap} from "prosemirror-keymap";
import {insertMathCmd, mathBackspaceCmd} from "@benrbray/prosemirror-math";
import {
    chainCommands,
    createParagraphNear,
    deleteSelection,
    joinBackward, joinDown, joinForward, joinUp, lift,
    newlineInCode,
    selectNodeBackward, selectNodeForward, setBlockType, splitBlock, toggleMark
} from "prosemirror-commands";
import {liftListItem, sinkListItem, splitListItem} from "prosemirror-schema-list";
import {redo, undo} from "prosemirror-history";

const mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false

/**
 * Builds input rules for a given schema.
 *
 * @param {Schema} schema - The schema to build input rules from.
 * @returns {InputRules} - The input rules for the given schema.
 */
export function buildInputRulesFromSchema(schema: Schema) {
    const rules = smartQuotes.concat(ellipsis, emDash)
    rules.push(rule.blockQuoteRule(schema.nodes.blockquote));
    rules.push(rule.bulletListRule(schema.nodes.bullet_list));
    rules.push(rule.codeBlockRule(schema.nodes.code_block));
    rules.push(rule.headingRule(schema.nodes.heading, 6));
    // TODO : table

    // math
    rules.push(rule.makeInlineMathInputRule(schema.nodes.math_inline));
    rules.push(rule.makeBlockMathInputRule(schema.nodes.math_display));
    return inputRules({rules})
}

/**
 * Builds a key map from the given schema.
 *
 * @param {Schema} schema - The schema to build the key map from.
 * @return {Keymap} - The key map generated from the schema.
 */
export function buildKeyMapFromSchema(schema: Schema) {

    const baseBinding = {
        "Mod-Space": insertMathCmd(schema.nodes.math_inline),
        "Backspace": chainCommands(deleteSelection, mathBackspaceCmd, joinBackward, selectNodeBackward),
        "Enter": splitListItem(schema.nodes.list_item),
        "Ctrl-Enter": chainCommands(newlineInCode, createParagraphNear, splitBlock),
        "Delete": chainCommands(deleteSelection, joinForward, selectNodeForward),
        "Shift-Ctrl-0": setBlockType(schema.nodes.paragraph),
        "Shift-Ctrl-1": setBlockType(schema.nodes.heading, { level: 1 }),
        "Shift-Ctrl-2": setBlockType(schema.nodes.heading, { level: 2 }),
        "Shift-Ctrl-3": setBlockType(schema.nodes.heading, { level: 3 }),
        "Shift-Ctrl-4": setBlockType(schema.nodes.heading, { level: 4 }),
        "Shift-Ctrl-5": setBlockType(schema.nodes.heading, { level: 5 }),
        "Shift-Ctrl-6": setBlockType(schema.nodes.heading, { level: 6 }),
        "Alt-ArrowUp": joinUp,
        "Alt-ArrowDown": joinDown,
        "Mod-BracketLeft": lift,
        "Mod-z": undo,
        "Mod-`": toggleMark(schema.marks.code),
        "Mod-i": toggleMark(schema.marks.em),
        "Mod-I": toggleMark(schema.marks.em),
        "Mod-b": toggleMark(schema.marks.strong),
        "Mod-B": toggleMark(schema.marks.strong),
        "Mod-[": liftListItem(schema.nodes.math_inline),
        "Mod-]": sinkListItem(schema.nodes.math_inline),
        "Shift-Ctrl-\\": setBlockType(schema.nodes.code_block),
    }

    if(mac){ // mac-os
        return keymap({
            ...baseBinding,
            "Mod-y": redo,
        })
    }
    return keymap({
        ...baseBinding,
        "Shift-Mod-z":redo,
    })

}
