/**
 * @hugsylabs/plugin-security-engineer
 * Security Engineer Subagent Plugin for Claude Code
 *
 * This plugin adds a specialized security engineering subagent to Claude Code
 * with deep expertise in infrastructure security, DevSecOps, and cloud security.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the security-engineer subagent markdown file
const securityEngineerContent = readFileSync(join(__dirname, 'security-engineer.md'), 'utf-8');

// Parse the frontmatter to extract metadata
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content };
  }

  const [, frontmatter, body] = match;
  const metadata = {};

  // Parse YAML-like frontmatter
  frontmatter.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      // Handle tools as array
      if (key === 'tools') {
        metadata[key] = value.split(',').map((t) => t.trim());
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content: body.trim() };
}

const { metadata, content } = parseFrontmatter(securityEngineerContent);

export default {
  name: 'plugin-security-engineer',
  version: '0.0.1',
  description: 'Adds a specialized security engineering subagent with DevSecOps expertise',

  transform(config) {
    // Initialize config structures
    config.subagents = config.subagents || {};

    // Handle different subagents configuration formats
    if (Array.isArray(config.subagents)) {
      // Convert array format to object format
      config.subagents = {
        presets: config.subagents,
        agents: {}
      };
    } else if (!config.subagents.agents) {
      // Ensure agents object exists
      config.subagents.agents = config.subagents.agents || {};
    }

    // Add the security-engineer subagent
    config.subagents.agents = config.subagents.agents || {};
    config.subagents.agents['security-engineer'] = {
      name: metadata.name || 'security-engineer',
      description: metadata.description || 'Security engineering expert',
      tools: metadata.tools || [
        'Read',
        'Write',
        'MultiEdit',
        'Bash',
        'Grep',
        'LS',
        'WebFetch',
        'WebSearch'
      ],
      content
    };

    return config;
  }
};
