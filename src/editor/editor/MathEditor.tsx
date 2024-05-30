import React, { useEffect, useRef } from 'react'
import { mathSerializer} from "@benrbray/prosemirror-math";
import { DOMParser } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { EditorState} from "prosemirror-state";
import {customSchema as schema} from "./model/schema.ts";
import {pluginSetUp} from "./plugin";


const MyEditor = () => {
    const editorRef = useRef(null);
    const initialRef = useRef(null)

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const state = EditorState.create({
            schema: schema,
            doc:  DOMParser.fromSchema(schema).parse(initialRef.current as unknown as HTMLElement),
            plugins : pluginSetUp({schema})
        })

        const view = new EditorView(editorRef.current, {
            state,
            clipboardTextSerializer: (slice) => {
                return mathSerializer.serializeSlice(slice)
            }
        })

        // focus
        view.focus()

        // new MyEditorView(editorRef.current, "hi")

    }, []);

    const html = `
        <h3>Math</h3>
        <blockquote>$..$ 입력 또는 $$ 입력으로 수식을 입력할 수 있다</blockquote>
        <p></p>
        <math-display>A_0 = \\mathrm{Span}\\left\\{
        \\begin{aligned}[c]
        (v_1 + v_2) \\otimes w - (v_1 \\otimes w) - (v_2 \\otimes w) \\\\
        v \\otimes (w_1 + w_2) - (v \\otimes w_1) - (v \\otimes w_2) \\\\
        (\\alpha v) \\otimes w - \\alpha (v \\otimes w) \\\\
        v \\otimes (\\alpha w) - \\alpha (v \\otimes w)
        \\end{aligned}
        \\;\\middle\\vert\\;
        \\begin{array}{l}
        \\alpha \\in F \\\\ v \\in V, w \\in W
        \\end{array}
        \\right\\}</math-display>
        <ul>
            <li>$..$ : inline-math</li>
            <li>$$ : math-block</li>
        </ul>
        <p></p>
    `

    return (
        <div className="content">
            <div className="center">
                <div id="editor" ref={editorRef} spellCheck="false"></div>
            </div>
            <div id="editor-content" ref={initialRef} style={{display: "none"}}>
                <div dangerouslySetInnerHTML={{__html:html}}/>
            </div>
        </div>
    )
}
export default React.memo(MyEditor);