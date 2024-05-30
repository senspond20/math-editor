import { useEffect, useRef } from 'react'
import {
    createMathSchema, mathPlugin, mathSerializer,
    makeBlockMathInputRule, makeInlineMathInputRule,
    REGEX_INLINE_MATH_DOLLARS, REGEX_BLOCK_MATH_DOLLARS,
    mathBackspaceCmd, insertMathCmd
} from "@benrbray/prosemirror-math";
import { DOMParser } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { EditorState} from "prosemirror-state";
import { chainCommands, newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock, deleteSelection, joinForward, selectNodeForward, selectNodeBackward, joinBackward } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { inputRules } from "prosemirror-inputrules";


const MyEditor = () => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const editorSchema = createMathSchema();
        const inlineMathInputRule = makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, editorSchema.nodes.math_inline);
        const blockMathInputRule = makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, editorSchema.nodes.math_display);

        const plugins = [
            mathPlugin,
            keymap({
                "Mod-Space": insertMathCmd(editorSchema.nodes.math_inline),
                "Backspace": chainCommands(deleteSelection, mathBackspaceCmd, joinBackward, selectNodeBackward),
                "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
                "Ctrl-Enter": chainCommands(newlineInCode, createParagraphNear, splitBlock),
                "Delete": chainCommands(deleteSelection, joinForward, selectNodeForward)
            }),
            inputRules({rules: [inlineMathInputRule, blockMathInputRule]})
        ];

        const state = EditorState.create({
            schema: editorSchema,
            doc: DOMParser.fromSchema(editorSchema).parse(document.getElementById("editor-content") as HTMLElement),
            plugins
        })

        new EditorView(editorRef.current, {
            state,
            clipboardTextSerializer: (slice) => {
                return mathSerializer.serializeSlice(slice)
            }
        });


    }, []);

    return (
        <div className="content">
            <div className="center">
                <div id="editor"  ref={editorRef} spellCheck="false" ></div>
            </div>
            <div id="editor-content" style={{display:"none"}}></div>
        </div>
    )
}
export default MyEditor;