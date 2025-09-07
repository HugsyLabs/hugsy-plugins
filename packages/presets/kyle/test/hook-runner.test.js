import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock fs module
vi.mock('fs');

describe('Hook Runner', () => {
  let hookRunner;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module cache to ensure fresh import
    vi.resetModules();
  });

  describe('findHookFile', () => {
    it('should find hook in node_modules when installed as package', () => {
      const mockExists = vi.spyOn(fs, 'existsSync');
      mockExists.mockImplementation((path) => {
        return path.includes('node_modules/@hugsy/preset-kyle/hooks/test.js');
      });

      hookRunner = require('../hooks/hook-runner');
      const result = hookRunner.findHookFile('test.js');
      
      expect(result).toContain('node_modules');
      expect(result).toContain('@hugsy/preset-kyle');
      expect(result).toContain('test.js');
    });

    it('should find hook in local directory during development', () => {
      const mockExists = vi.spyOn(fs, 'existsSync');
      mockExists.mockImplementation((path) => {
        return path.endsWith('/hooks/test.js') && !path.includes('node_modules');
      });

      hookRunner = require('../hooks/hook-runner');
      const result = hookRunner.findHookFile('test.js');
      
      expect(result).toContain('hooks');
      expect(result).toContain('test.js');
      expect(result).not.toContain('node_modules');
    });

    it('should return null when hook is not found', () => {
      const mockExists = vi.spyOn(fs, 'existsSync');
      mockExists.mockReturnValue(false);

      hookRunner = require('../hooks/hook-runner');
      const result = hookRunner.findHookFile('nonexistent.js');
      
      expect(result).toBeNull();
    });

    it('should check multiple paths in order', () => {
      const mockExists = vi.spyOn(fs, 'existsSync');
      const checkedPaths = [];
      mockExists.mockImplementation((path) => {
        checkedPaths.push(path);
        return false;
      });

      hookRunner = require('../hooks/hook-runner');
      hookRunner.findHookFile('test.js');
      
      expect(checkedPaths.length).toBeGreaterThan(2);
      expect(checkedPaths.some(p => p.includes('node_modules'))).toBe(true);
      expect(checkedPaths.some(p => p.includes('hooks'))).toBe(true);
    });
  });

  describe('sanitizeContent', () => {
    beforeEach(() => {
      hookRunner = require('../hooks/hook-runner');
    });

    it('should truncate content that exceeds max length', () => {
      const longContent = 'x'.repeat(15000);
      const result = hookRunner.sanitizeContent(longContent);
      
      expect(result.length).toBeLessThan(15000);
      expect(result).toContain('[content truncated]');
    });

    it('should redact API keys', () => {
      const content = 'api_key: "sk-123456789" and API-KEY=abc123';
      const result = hookRunner.sanitizeContent(content);
      
      expect(result).not.toContain('sk-123456789');
      expect(result).not.toContain('abc123');
      expect(result).toContain('[REDACTED]');
    });

    it('should redact passwords', () => {
      const content = 'password: "supersecret" and password = mysecret123';
      const result = hookRunner.sanitizeContent(content);
      
      expect(result).not.toContain('supersecret');
      expect(result).not.toContain('mysecret123');
      expect(result).toContain('[REDACTED]');
    });

    it('should redact tokens', () => {
      const content = 'token: "ghp_abcdef123456" and auth_token=xyz789';
      const result = hookRunner.sanitizeContent(content);
      
      expect(result).not.toContain('ghp_abcdef123456');
      expect(result).not.toContain('xyz789');
      expect(result).toContain('[REDACTED]');
    });

    it('should handle empty content', () => {
      const result = hookRunner.sanitizeContent('');
      expect(result).toBe('');
    });

    it('should handle null content', () => {
      const result = hookRunner.sanitizeContent(null);
      expect(result).toBe('');
    });

    it('should preserve content structure while redacting', () => {
      const content = 'const config = {\n  api_key: "secret",\n  url: "https://api.example.com"\n}';
      const result = hookRunner.sanitizeContent(content);
      
      expect(result).toContain('const config');
      expect(result).toContain('url:');
      expect(result).toContain('https://api.example.com');
      expect(result).toContain('[REDACTED]');
      expect(result).not.toContain('secret');
    });
  });

  describe('TIMEOUTS', () => {
    beforeEach(() => {
      hookRunner = require('../hooks/hook-runner');
    });

    it('should have correct timeout values', () => {
      expect(hookRunner.TIMEOUTS.QUICK).toBe(5000);
      expect(hookRunner.TIMEOUTS.NORMAL).toBe(10000);
      expect(hookRunner.TIMEOUTS.LONG).toBe(30000);
      expect(hookRunner.TIMEOUTS.EXTRA_LONG).toBe(60000);
    });

    it('should have ascending timeout values', () => {
      expect(hookRunner.TIMEOUTS.QUICK).toBeLessThan(hookRunner.TIMEOUTS.NORMAL);
      expect(hookRunner.TIMEOUTS.NORMAL).toBeLessThan(hookRunner.TIMEOUTS.LONG);
      expect(hookRunner.TIMEOUTS.LONG).toBeLessThan(hookRunner.TIMEOUTS.EXTRA_LONG);
    });
  });
});