/**
 * @hugsylabs/preset-kyle
 * Kyle's personalized preset with strict quality enforcement and architecture protection
 */

const presetConfig = require('./index.json');

module.exports = {
  name: 'preset-kyle',
  version: '1.0.0',
  description:
    "Kyle's personalized preset with strict quality enforcement and architecture protection",

  transform(config) {
    // Apply preset configuration

    // Add plugins if specified
    if (presetConfig.plugins && presetConfig.plugins.length > 0) {
      config.plugins = config.plugins || [];
      config.plugins.push(...presetConfig.plugins);
    }

    // Add slash commands
    if (presetConfig.slashCommands) {
      config.commands = config.commands || {};

      // Handle array format
      if (Array.isArray(config.commands)) {
        config.commands = { presets: config.commands };
      }

      // Add command packages
      if (presetConfig.slashCommands.packages) {
        config.commands.presets = config.commands.presets || [];
        config.commands.presets.push(...presetConfig.slashCommands.packages);
      }

      // Add local command files
      if (presetConfig.slashCommands.files) {
        config.commands.files = config.commands.files || [];
        config.commands.files.push(...presetConfig.slashCommands.files);
      }
    }

    // Add subagents
    if (presetConfig.subagents) {
      config.subagents = config.subagents || {};

      // Handle array format
      if (Array.isArray(config.subagents)) {
        config.subagents = { presets: config.subagents };
      }

      // Add subagent packages
      if (presetConfig.subagents.packages) {
        config.subagents.presets = config.subagents.presets || [];
        config.subagents.presets.push(...presetConfig.subagents.packages);
      }

      // Add local subagent files
      if (presetConfig.subagents.files) {
        config.subagents.files = config.subagents.files || [];
        config.subagents.files.push(...presetConfig.subagents.files);
      }
    }

    // Merge permissions
    if (presetConfig.permissions) {
      config.permissions = config.permissions || {};

      ['allow', 'ask', 'deny'].forEach((key) => {
        if (presetConfig.permissions[key]) {
          config.permissions[key] = config.permissions[key] || [];
          // Remove duplicates when merging
          const existingPerms = new Set(config.permissions[key]);
          presetConfig.permissions[key].forEach((perm) => {
            if (!existingPerms.has(perm)) {
              config.permissions[key].push(perm);
            }
          });
        }
      });
    }

    // Merge environment variables
    if (presetConfig.env) {
      config.env = config.env || {};
      Object.assign(config.env, presetConfig.env);
    }

    // Merge hooks
    if (presetConfig.hooks) {
      config.hooks = config.hooks || {};

      Object.keys(presetConfig.hooks).forEach((hookType) => {
        if (!config.hooks[hookType]) {
          config.hooks[hookType] = presetConfig.hooks[hookType];
        } else if (Array.isArray(config.hooks[hookType])) {
          config.hooks[hookType].push(...presetConfig.hooks[hookType]);
        } else {
          // Convert to array and merge
          config.hooks[hookType] = [config.hooks[hookType], ...presetConfig.hooks[hookType]];
        }
      });
    }
    return config;
  }
};
