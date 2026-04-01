#!/usr/bin/env node

/**
 * Get deployment platform from config
 * This script reads the deployment platform from src/config.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

function getDeploymentPlatform() {
  try {
    const configPath = join(process.cwd(), 'src', 'config.ts');
    const configContent = readFileSync(configPath, 'utf8');
    
    const platformMatches = [...configContent.matchAll(/platform:\s*["']([^"']+)["']/g)];
    
    // Get the last match, which is the actual configuration value, not the TypeScript type definition
    if (platformMatches && platformMatches.length > 0) {
      const lastMatch = platformMatches[platformMatches.length - 1];
      return lastMatch[1];
    }
    
    // Fallback to environment variable
    return process.env.DEPLOYMENT_PLATFORM || 'netlify';
  } catch (error) {
    console.error('Error reading config:', error.message);
    return process.env.DEPLOYMENT_PLATFORM || 'netlify';
  }
}

// Export for use in other scripts
export default getDeploymentPlatform;

// If run directly, output the platform
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(getDeploymentPlatform());
}