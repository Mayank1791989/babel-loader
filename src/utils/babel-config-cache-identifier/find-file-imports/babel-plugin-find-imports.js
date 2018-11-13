/* @flow */
import { declare } from '@babel/helper-plugin-utils';

export default declare(api => {
  api.assertVersion(7);

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const sourceNode = path.get('source').node;
        addImportToMetadata(state, sourceNode.value);
      },

      CallExpression(path, state) {
        const callee = path.get('callee');
        if (callee.isIdentifier() && callee.node.name === 'require') {
          const arg = path.get('arguments.0');
          if (arg.isStringLiteral()) {
            addImportToMetadata(state, arg.node.value);
          }
        }
      },
    },
  };
});

function addImportToMetadata(state, importStr: string) {
  const { metadata } = state.file;

  if (!metadata.findImports) {
    metadata.findImports = {
      imports: [],
    };
  }

  metadata.findImports.imports.push(importStr);
}

export function getImportsFromMetadata(metadata: Object): Array<string> {
  if (!metadata.findImports) {
    return [];
  }

  return metadata.findImports.imports;
}
