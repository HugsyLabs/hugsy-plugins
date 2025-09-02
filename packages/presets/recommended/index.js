/**
 * @hugsylabs/preset-recommended
 * Recommended preset for Hugsy - balanced configuration for most projects
 */

import presetConfig from './index.json' with { type: 'json' };

export default {
  name: 'preset-recommended',
  version: '0.0.1',
  description: 'Recommended configuration for most projects',
  
  transform(config) {
    // Apply preset configuration
    
    // Add plugins
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
      
      // Add preset packages
      if (presetConfig.slashCommands.packages) {
        config.commands.presets = config.commands.presets || [];
        config.commands.presets.push(...presetConfig.slashCommands.packages);
      }
    }
    
    // Merge permissions
    if (presetConfig.permissions) {
      config.permissions = config.permissions || {};
      
      ['allow', 'ask', 'deny'].forEach(key => {
        if (presetConfig.permissions[key]) {
          config.permissions[key] = config.permissions[key] || [];
          config.permissions[key].push(...presetConfig.permissions[key]);
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
      
      Object.keys(presetConfig.hooks).forEach(hookType => {
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