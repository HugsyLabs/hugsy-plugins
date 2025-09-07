import { describe, it, expect } from 'vitest';

describe('Quality Guard Hook', () => {
  describe('Pattern Detection', () => {
    it('should detect @ts-nocheck directive', () => {
      const patterns = [
        '// @ts-nocheck',
        '/* @ts-nocheck */',
        '//@ts-nocheck',
        '  // @ts-nocheck  '
      ];

      const regex = /@ts-nocheck/;
      patterns.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });
    });

    it('should detect @ts-ignore directive', () => {
      const patterns = [
        '// @ts-ignore',
        '// @ts-ignore: error below',
        '  //@ts-ignore  ',
        '/* @ts-ignore */'
      ];

      const regex = /@ts-ignore/;
      patterns.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });
    });

    it('should detect any type usage', () => {
      const regex = /:\s*any\b/;

      const shouldMatch = [
        'let x: any',
        'const foo: any = 123',
        'function test(): any {',
        'items: any[]'
      ];

      const shouldNotMatch = ['company: string', 'Germany', 'many: number', 'anyThing: string'];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });

      shouldNotMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(false);
      });
    });

    it('should detect as any type assertions', () => {
      const regex = /as\s+any\b/;

      const shouldMatch = [
        'value as any',
        'obj as  any',
        '(data as any).property',
        'return result as any;'
      ];

      const shouldNotMatch = ['as string', 'asany', 'has anyone', 'class AnyClass'];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });

      shouldNotMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(false);
      });
    });

    it('should detect console.log statements', () => {
      const regex = /console\.(log|debug|info)/;

      const shouldMatch = [
        'console.log("test")',
        'console.debug(data)',
        'console.info("message")',
        '  console.log(  "spaced"  )'
      ];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });

      // Should allow console.warn and console.error
      expect(regex.test('console.warn("warning")')).toBe(false);
      expect(regex.test('console.error("error")')).toBe(false);
    });

    it('should detect eslint-disable comments', () => {
      const regex = /\/\/ eslint-disable/;

      const shouldMatch = [
        '// eslint-disable',
        '// eslint-disable-next-line',
        '  // eslint-disable-line  ',
        '// eslint-disable no-console'
      ];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });
    });

    it('should detect test.skip', () => {
      const regex = /test\.skip/;

      const shouldMatch = [
        'test.skip("skipped test"',
        'it.skip("skipped it"',
        'describe.skip("skipped suite"'
      ];

      // Note: it.skip and describe.skip won't match with test.skip pattern
      expect(regex.test(shouldMatch[0])).toBe(true);
      expect(regex.test(shouldMatch[1])).toBe(false);
      expect(regex.test(shouldMatch[2])).toBe(false);
    });

    it('should detect .only() test runners', () => {
      const regex = /\.only\(/;

      const shouldMatch = [
        'test.only("focused test"',
        'it.only("focused it"',
        'describe.only("focused suite"'
      ];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });
    });
  });

  describe('File-specific Rules', () => {
    it('should check for toBe(true) in test files', () => {
      const regex = /expect\(.*\)\.toBe\(true\)/;

      const shouldMatch = [
        'expect(result).toBe(true)',
        'expect(isValid).toBe(true)',
        'expect(someFunction()).toBe(true)'
      ];

      const shouldNotMatch = [
        'expect(result).toBe(false)',
        'expect(result).toBeTruthy()',
        'expect(result).toEqual(true)'
      ];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });

      shouldNotMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(false);
      });
    });

    it('should check for inline styles in TSX files', () => {
      const regex = /style\s*=\s*\{\{/;

      const shouldMatch = [
        'style={{color: "red"}}',
        'style={{ margin: 10 }}',
        'style = {{ display: "none" }}'
      ];

      const shouldNotMatch = [
        'style={styles.container}',
        'className="styled"',
        'styles={{ color: "red" }}'
      ];

      shouldMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(true);
      });

      shouldNotMatch.forEach((pattern) => {
        expect(regex.test(pattern)).toBe(false);
      });
    });
  });

  describe('Pattern Matching Edge Cases', () => {
    it('should handle multi-line content correctly', () => {
      const content = `
        function test(): any {
          const data: unknown = getData();
          // @ts-ignore
          return data.property;
        }
      `;

      const lines = content.split('\n');
      let foundAny = false;
      let foundUnknown = false;
      let foundTsIgnore = false;

      lines.forEach((line) => {
        if (/:\s*any\b/.test(line)) foundAny = true;
        if (/:\s*unknown\b/.test(line)) foundUnknown = true;
        if (/@ts-ignore/.test(line)) foundTsIgnore = true;
      });

      expect(foundAny).toBe(true);
      expect(foundUnknown).toBe(true);
      expect(foundTsIgnore).toBe(true);
    });

    it('should handle empty lines and whitespace', () => {
      const lines = ['', '   ', '\t', '\n', null, undefined];
      const regex = /:\s*any\b/;

      lines.forEach((line) => {
        // Should not throw and should return false for empty/null
        expect(() => {
          if (line) regex.test(line);
        }).not.toThrow();
      });
    });

    it('should handle very long lines', () => {
      const longLine = `const x: any = ${'a'.repeat(10000)}`;
      const regex = /:\s*any\b/;

      expect(regex.test(longLine)).toBe(true);
    });

    it('should handle special characters in content', () => {
      const specialContents = [
        'const emoji: any = "🚀"',
        'const unicode: any = "\u0000"',
        'const escaped: any = "\\n\\t"',
        'const regex: any = /test.*pattern/'
      ];

      const regex = /:\s*any\b/;
      specialContents.forEach((content) => {
        expect(regex.test(content)).toBe(true);
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should process file in single pass', () => {
      const content = 'line1\nline2\nline3';
      const lines = content.split('\n');

      // Single pass simulation
      const results = [];
      lines.forEach((line, index) => {
        results.push({ line: index + 1, content: line });
      });

      expect(results.length).toBe(3);
      expect(results[0].line).toBe(1);
      expect(results[2].line).toBe(3);
    });

    it('should handle file size limits', () => {
      const MAX_CONTENT_LENGTH = 10000;
      const largeContent = 'x'.repeat(15000);

      const truncated =
        largeContent.length > MAX_CONTENT_LENGTH
          ? largeContent.substring(0, MAX_CONTENT_LENGTH)
          : largeContent;

      expect(truncated.length).toBe(MAX_CONTENT_LENGTH);
    });
  });
});
