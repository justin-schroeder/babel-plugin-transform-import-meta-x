import { smart } from '@babel/template';
import type { PluginObj, NodePath } from '@babel/core';
import type { Statement, MemberExpression } from '@babel/types';

export interface PluginOptions {
  replacements: Record<string, string>
}

/**
 * Rewrites known `import.meta`[1] properties into equivalent non-module node.js
 * expressions. In order to maintain compatibility with plugins transforming
 * non-standard properties, this plugin transforms only known properties and
 * does not touch expressions with unknown or without member property access.
 * Properties known to this plugin:
 *
 * - `url`[2]
 *
 * [1]: https://github.com/tc39/proposal-import-meta
 * [2]: https://html.spec.whatwg.org/#hostgetimportmetaproperties
 */
export default function (): PluginObj {
  return {
    name: 'transform-import-meta',

    visitor: {
      Program (path, state) {
        const { replacements }: PluginOptions = { replacements: {}, ...(state.opts ?? {}) };

        const metas: Array<[node: NodePath<MemberExpression>, replacement: string]> = [];
        const identifiers = new Set<string>();

        path.traverse({
          MemberExpression (memberExpPath) {
            const { node } = memberExpPath;

            if (
              node.object.type === 'MetaProperty' &&
              node.object.meta.name === 'import' &&
              node.object.property.name === 'meta' &&
              node.property.type === 'Identifier' &&
              node.property.name in replacements
            ) {
              const replacement = replacements[node.property.name] as string;
              metas.push([memberExpPath, replacement]);
              for (const name of Object.keys(memberExpPath.scope.getAllBindings())) {
                identifiers.add(name);
              }
            }
          }
        });

        if (metas.length === 0) {
          return;
        }

        for (const [node, replacement] of metas) {
          const metaReplacement = smart.ast`${replacement}` as Statement;
          node.replaceWith(metaReplacement);
        }
      }
    }
  };
}
