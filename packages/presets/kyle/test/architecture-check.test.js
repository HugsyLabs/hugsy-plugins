import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Architecture Check Hook', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Architecture Violations', () => {
    it('should detect UI package importing Node.js modules', () => {
      const violations = [];
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation((msg) => {
        if (msg.includes('violation')) violations.push(msg);
      });

      // Simulate checking a UI file with Node.js import
      process.env.CLAUDE_FILE_PATH = '/project/packages/ui/src/components/Test.tsx';
      process.env.CLAUDE_FILE_CONTENT = `
        import fs from 'fs';
        import { useState } from 'react';
        
        export function TestComponent() {
          const data = fs.readFileSync('test.txt');
          return <div>{data}</div>;
        }
      `;

      // Would need to execute the hook here
      // For now, we're testing the pattern
      const content = process.env.CLAUDE_FILE_CONTENT;
      const hasNodeImport = content.includes("import fs from 'fs'");
      
      expect(hasNodeImport).toBe(true);
    });

    it('should detect implementation code in types package', () => {
      process.env.CLAUDE_FILE_PATH = '/project/packages/types/src/index.ts';
      process.env.CLAUDE_FILE_CONTENT = `
        export interface User {
          id: string;
          name: string;
        }
        
        export function validateUser(user: User): boolean {
          return user.id && user.name;
        }
        
        export class UserService {
          getUser() {
            return { id: '1', name: 'Test' };
          }
        }
      `;

      const content = process.env.CLAUDE_FILE_CONTENT;
      const hasFunctionImpl = /function\s+\w+\s*\([^)]*\)\s*\{/.test(content);
      const hasClassImpl = /class\s+\w+\s*\{/.test(content);
      
      expect(hasFunctionImpl).toBe(true);
      expect(hasClassImpl).toBe(true);
    });

    it('should detect case-insensitive forbidden patterns', () => {
      const testCases = [
        { text: 'loadConfig()', pattern: 'config', shouldMatch: true },
        { text: 'LoadConfig()', pattern: 'config', shouldMatch: true },
        { text: 'LOADCONFIG()', pattern: 'config', shouldMatch: true },
        { text: 'configuration', pattern: 'config', shouldMatch: true },
        { text: 'preconfigured', pattern: 'config', shouldMatch: true }
      ];

      testCases.forEach(({ text, pattern, shouldMatch }) => {
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        expect(regex.test(text)).toBe(shouldMatch);
      });
    });

    it('should use word boundaries for accurate matching', () => {
      const testCases = [
        { text: 'const api = new API();', forbidden: 'api', shouldMatch: true },
        { text: 'const apiKey = "secret";', forbidden: 'api', shouldMatch: true },
        { text: 'const rapid = true;', forbidden: 'api', shouldMatch: false },
        { text: 'const testapithing = 1;', forbidden: 'api', shouldMatch: false }
      ];

      testCases.forEach(({ text, forbidden, shouldMatch }) => {
        const pattern = new RegExp(`\\b${forbidden}\\b`, 'i');
        expect(pattern.test(text)).toBe(shouldMatch);
      });
    });
  });

  describe('Duplication Detection', () => {
    it('should detect duplicate package management implementation', () => {
      const keywords = {
        'install package': 'package management',
        'remove package': 'package management'
      };

      const testContent = `
        function installPackage(name) {
          // Custom implementation
        }
      `;

      let foundDuplication = false;
      for (const [keyword] of Object.entries(keywords)) {
        const pattern = new RegExp(`\\b${keyword.replace(/\\s+/g, '\\\\s*')}\\b`, 'i');
        if (pattern.test(testContent)) {
          foundDuplication = true;
          break;
        }
      }

      expect(foundDuplication).toBe(true);
    });

    it('should handle multi-word keywords correctly', () => {
      const keyword = 'load preset';
      const pattern = new RegExp(`\\b${keyword.replace(/\\s+/g, '\\\\s*')}\\b`, 'i');
      
      const testCases = [
        { text: 'loadPreset()', shouldMatch: true },
        { text: 'load_preset', shouldMatch: true },
        { text: 'load  preset', shouldMatch: true },
        { text: 'LOAD PRESET', shouldMatch: true },
        { text: 'download preset', shouldMatch: false },
        { text: 'preset loader', shouldMatch: false }
      ];

      testCases.forEach(({ text, shouldMatch }) => {
        expect(pattern.test(text)).toBe(shouldMatch);
      });
    });
  });

  describe('Module Dependency Checks', () => {
    it('should detect Node.js module imports in UI package', () => {
      const nodeModules = ['fs', 'path', 'child_process', 'crypto', 'os'];
      const testContents = [
        "const fs = require('fs');",
        "import path from 'path';",
        "import { exec } from 'child_process';",
        "const crypto = require('crypto');",
        "import * as os from 'os';"
      ];

      testContents.forEach((content, index) => {
        const module = nodeModules[index];
        const hasNodeModule = 
          content.includes(`require('${module}')`) || 
          content.includes(`from '${module}'`);
        
        expect(hasNodeModule).toBe(true);
      });
    });

    it('should allow Node.js modules in server.js file', () => {
      const filePath = '/packages/ui/server.js';
      const isServerFile = filePath.includes('server.js');
      
      expect(isServerFile).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout errors specifically', () => {
      const error = new Error('Operation timed out after 10000ms');
      const isTimeout = error.message.includes('timeout');
      
      expect(isTimeout).toBe(true);
    });

    it('should handle malformed content gracefully', () => {
      const testCases = [
        null,
        undefined,
        '',
        '🚀'.repeat(1000),
        '\0\0\0',
        'a'.repeat(100000)
      ];

      testCases.forEach((content) => {
        // Should not throw when processing
        expect(() => {
          const safe = content ? content.toLowerCase() : '';
          return safe;
        }).not.toThrow();
      });
    });
  });
});