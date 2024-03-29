import * as babelCore from '@babel/core';
import dedent from 'ts-dedent';
import importMetaPlugin from './index';
import type { PluginOptions } from './index';

describe('babel-plugin-import-meta-x', () => {
  test('does not transform non-meta property', () => {
    const input = dedent(`
      console.log(foo.import.meta);
    `);

    const expected = dedent(`
      console.log(foo.import.meta);
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform import.meta if known property is not specified', () => {
    const input = dedent(`
      console.log(import.meta);
    `);

    const expected = dedent(`
      console.log(import.meta);
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform unknown meta properties', () => {
    const input = dedent(`
      console.log(import.meta.foo);
    `);

    const expected = dedent(`
      console.log(import.meta.foo);
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  describe('ES5', () => {
    test('transforms import.meta.url', () => {
      const pluginOptions: PluginOptions | undefined = { replacements: { url: 'require(\'url\').pathToFileURL(__filename).toString()' } };
      const input = dedent(`
        console.log(import.meta.url);
      `);

      const expected = dedent(`
        console.log(require('url').pathToFileURL(__filename).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.dinosaur', () => {
      const pluginOptions: PluginOptions | undefined = { replacements: { dinosaur: '"Sasha Milenkovic"' } };
      const input = dedent(`
        console.log(import.meta.dinosaur);
      `);

      const expected = dedent(`
        console.log("Sasha Milenkovic");
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });
  });
});
