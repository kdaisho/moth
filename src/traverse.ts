import { AST, VariableDeclaration, Visitor, VisitorMethod } from './types'

function traverseArray({
    array,
    parent,
    visitor,
}: {
    array: AST[]
    parent?: AST
    visitor: Visitor
}) {
    array.forEach(node => {
        traverseNode({ node, parent, visitor })
    })
}

function traverseNode({
    node,
    parent,
    visitor,
}: {
    node: AST | VariableDeclaration
    parent?: AST
    visitor: Visitor
}) {
    if (!('type' in node)) return

    const methods = visitor[node.type as keyof typeof visitor] as {
        enter?: VisitorMethod
        exit?: VisitorMethod
    }

    if (methods && methods.enter) {
        methods.enter({ node })
    }

    if ('arguments' in node && node.arguments) {
        traverseArray({
            array: node.arguments,
            parent: node,
            visitor,
        })
    }

    if (methods && methods.exit) {
        methods.exit({ node, parent })
    }
}

export default (node: AST | VariableDeclaration, visitor: Visitor) => {
    traverseNode({ node, visitor })
}
