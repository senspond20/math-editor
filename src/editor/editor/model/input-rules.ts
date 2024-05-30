import {NodeType} from "prosemirror-model"
import {InputRule, wrappingInputRule, textblockTypeInputRule} from "prosemirror-inputrules";
import { NodeSelection } from "prosemirror-state";

/**
 * CustomInputRules is a utility class for defining input rules
 */
export class CustomInputRules{

    static headingRule(nodeType: NodeType, maxLevel: number) {
        return textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"),
            nodeType, match => ({level: match[1].length}))
    }

    static blockQuoteRule(nodeType: NodeType) {
        return wrappingInputRule(/^\s*>\s$/, nodeType)
    }

    static orderedListRule(nodeType: NodeType) {
        return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({order: +match[1]}),
            (match, node) => node.childCount + node.attrs.order == +match[1])
    }

    static bulletListRule(nodeType: NodeType) {
        return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
    }

    static codeBlockRule(nodeType: NodeType) {
        //return textblockTypeInputRule(/^```$/, nodeType)
        return new InputRule(/^```(.*)\s+$/, (state, match, start, end) => {
            const lang : string = match[1]
            const $start = state.doc.resolve(start)
            if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null
            const tr = state.tr
                .delete(start, end)
                .setBlockType(start, start, nodeType, {language : lang});

            return tr.setSelection(NodeSelection.create(
                tr.doc, tr.mapping.map($start.pos - 1)
            ));
        })
    }

    static makeInlineMathInputRule(nodeType: NodeType, getAttrs?: (match: string[]) => never) {
        return new InputRule(/\$(.+)\$/, (state, match, start, end) => {
            const $start = state.doc.resolve(start);
            const index = $start.index();
            const $end = state.doc.resolve(end);
            // get attrs
            const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
            // check if replacement valid
            if (!$start.parent.canReplaceWith(index, $end.index(), nodeType)) {
                return null;
            }
            // perform replacement
            return state.tr.replaceRangeWith(
                start, end,
                nodeType.create(attrs, nodeType.schema.text(match[1]))
            );
        });
    }

    static makeBlockMathInputRule(nodeType: NodeType, getAttrs?: (match: string[]) => never) {
        return new InputRule(/\$\$\s+$/, (state, match, start, end) => {
            const $start = state.doc.resolve(start)
            const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
            if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null
            const tr = state.tr
                .delete(start, end)
                .setBlockType(start, start, nodeType, attrs);

            return tr.setSelection(NodeSelection.create(
                tr.doc, tr.mapping.map($start.pos - 1)
            ));
        })
    }

}


