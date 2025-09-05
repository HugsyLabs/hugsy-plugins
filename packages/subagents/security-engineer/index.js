/**
 * @hugsylabs/subagent-security-engineer
 * Security Engineer Subagent for Claude Code
 *
 * This package exports a security engineering subagent with deep expertise
 * in infrastructure security, DevSecOps, and cloud security.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the subagent markdown file
const subagentContent = readFileSync(join(__dirname, 'security-engineer.md'), 'utf-8');

// Parse frontmatter to extract metadata
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

const { metadata, content } = parseFrontmatter(subagentContent);

// Export the subagent configuration
export const subagents = {
  'security-engineer': {
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
  }
};

export default { subagents };
