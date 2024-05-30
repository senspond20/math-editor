import {Schema} from "prosemirror-model";
import {menuBar, MenuElement} from "prosemirror-menu";
import {keymap} from "prosemirror-keymap";
import {baseKeymap} from "prosemirror-commands";
import {dropCursor} from "prosemirror-dropcursor";
import {gapCursor} from "prosemirror-gapcursor";
import {history} from "prosemirror-history";
import {buildInputRulesFromSchema, buildKeyMapFromSchema} from "../model";
import {mathPlugin} from "@benrbray/prosemirror-math";
import {buildMenuItems} from "prosemirror-example-setup";

export function pluginSetUp(options: {
    /// The schema to generate key bindings and menu items for.
    schema: Schema

    /// Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
    mapKeys?: {[key: string]: string | false}

    /// Set to false to disable the menu bar.
    menuBar?: boolean

    /// Set to false to disable the history plugin.
    history?: boolean

    /// Set to false to make the menu bar non-floating.
    floatingMenu?: boolean

    /// Can be used to override the menu content.
    menuContent?: MenuElement[][]

}) {
    const plugins = [
        mathPlugin,
        buildInputRulesFromSchema(options.schema),
        buildKeyMapFromSchema(options.schema),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
    ]
    if (options.menuBar !== false)
        plugins.push(menuBar({
            floating: options.floatingMenu !== false,
            content: options.menuContent || buildMenuItems(options.schema).fullMenu
        }))
    if (options.history !== false)
        plugins.push(history())

    return plugins;
}