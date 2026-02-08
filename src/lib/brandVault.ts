/**
 * Brand Vault - Version History Management
 * 
 * "Your brand assets are never lost. Every version saved."
 * 
 * Stores up to 5 versions of brand kits in localStorage
 */

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface BrandKit {
  colors: BrandColor[];
  fonts: {
    heading: { name: string; weight: string; style: string };
    body: { name: string; weight: string; style: string };
    reasoning: string;
  };
  brandVoice: {
    tone: string;
    taglines: string[];
    description: string;
  };
  logoDirection: {
    concept: string;
    style: string;
    elements: string[];
  };
  socialMedia: {
    profileGuidelines: string;
    coverGuidelines: string;
    colorApplications: string[];
    platforms: { name: string; profileSize: string; coverSize: string }[];
  };
}

export interface BrandVersion {
  id: string;
  version: number;
  businessName: string;
  industry: string;
  style: string;
  brandKit: BrandKit;
  createdAt: string;
  note?: string;
}

export interface BrandVaultData {
  versions: BrandVersion[];
  currentVersionId: string | null;
  maxVersions: number;
}

const STORAGE_KEY = 'brandsnap_vault';
const MAX_VERSIONS = 5;

/**
 * Generate a unique ID for versions
 */
const generateId = (): string => {
  return `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get the brand vault data from localStorage
 */
export const getVault = (): BrandVaultData => {
  if (typeof window === 'undefined') {
    return { versions: [], currentVersionId: null, maxVersions: MAX_VERSIONS };
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading vault:', error);
  }
  
  return { versions: [], currentVersionId: null, maxVersions: MAX_VERSIONS };
};

/**
 * Save the vault data to localStorage
 */
const saveVault = (vault: BrandVaultData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  } catch (error) {
    console.error('Error saving vault:', error);
  }
};

/**
 * Save a new brand kit version to the vault
 * Keeps only the last 5 versions
 */
export const saveBrandVersion = (
  businessName: string,
  industry: string,
  style: string,
  brandKit: BrandKit,
  note?: string
): BrandVersion => {
  const vault = getVault();
  
  // Calculate next version number for this business
  const existingVersions = vault.versions.filter(
    v => v.businessName.toLowerCase() === businessName.toLowerCase()
  );
  const nextVersion = existingVersions.length > 0 
    ? Math.max(...existingVersions.map(v => v.version)) + 1 
    : 1;
  
  const newVersion: BrandVersion = {
    id: generateId(),
    version: nextVersion,
    businessName,
    industry,
    style,
    brandKit,
    createdAt: new Date().toISOString(),
    note
  };
  
  // Add new version at the beginning
  vault.versions.unshift(newVersion);
  
  // Keep only the last MAX_VERSIONS versions (per business)
  const businessVersions = vault.versions.filter(
    v => v.businessName.toLowerCase() === businessName.toLowerCase()
  );
  
  if (businessVersions.length > MAX_VERSIONS) {
    const versionsToRemove = businessVersions.slice(MAX_VERSIONS);
    vault.versions = vault.versions.filter(
      v => !versionsToRemove.some(r => r.id === v.id)
    );
  }
  
  vault.currentVersionId = newVersion.id;
  saveVault(vault);
  
  return newVersion;
};

/**
 * Get all versions for a specific business
 */
export const getVersionsForBusiness = (businessName: string): BrandVersion[] => {
  const vault = getVault();
  return vault.versions
    .filter(v => v.businessName.toLowerCase() === businessName.toLowerCase())
    .sort((a, b) => b.version - a.version);
};

/**
 * Get a specific version by ID
 */
export const getVersionById = (id: string): BrandVersion | null => {
  const vault = getVault();
  return vault.versions.find(v => v.id === id) || null;
};

/**
 * Get the current/latest version
 */
export const getCurrentVersion = (): BrandVersion | null => {
  const vault = getVault();
  if (vault.currentVersionId) {
    return getVersionById(vault.currentVersionId);
  }
  return vault.versions[0] || null;
};

/**
 * Set a version as the current active one
 */
export const setCurrentVersion = (id: string): BrandVersion | null => {
  const vault = getVault();
  const version = vault.versions.find(v => v.id === id);
  
  if (version) {
    vault.currentVersionId = id;
    saveVault(vault);
    return version;
  }
  
  return null;
};

/**
 * Restore a previous version (creates a new version with the old data)
 */
export const restoreVersion = (id: string): BrandVersion | null => {
  const oldVersion = getVersionById(id);
  
  if (!oldVersion) return null;
  
  return saveBrandVersion(
    oldVersion.businessName,
    oldVersion.industry,
    oldVersion.style,
    oldVersion.brandKit,
    `Restored from v${oldVersion.version}`
  );
};

/**
 * Delete a specific version
 */
export const deleteVersion = (id: string): boolean => {
  const vault = getVault();
  const initialLength = vault.versions.length;
  
  vault.versions = vault.versions.filter(v => v.id !== id);
  
  if (vault.currentVersionId === id) {
    vault.currentVersionId = vault.versions[0]?.id || null;
  }
  
  saveVault(vault);
  return vault.versions.length < initialLength;
};

/**
 * Compare two brand kit versions and return the differences
 */
export interface BrandDiff {
  colors: {
    added: BrandColor[];
    removed: BrandColor[];
    changed: { old: BrandColor; new: BrandColor }[];
  };
  fonts: {
    headingChanged: boolean;
    bodyChanged: boolean;
    oldHeading?: string;
    newHeading?: string;
    oldBody?: string;
    newBody?: string;
  };
  brandVoice: {
    toneChanged: boolean;
    oldTone?: string;
    newTone?: string;
    taglinesAdded: string[];
    taglinesRemoved: string[];
  };
  logoDirection: {
    conceptChanged: boolean;
    oldConcept?: string;
    newConcept?: string;
    elementsAdded: string[];
    elementsRemoved: string[];
  };
  hasChanges: boolean;
}

export const compareBrandKits = (oldKit: BrandKit, newKit: BrandKit): BrandDiff => {
  const diff: BrandDiff = {
    colors: { added: [], removed: [], changed: [] },
    fonts: { headingChanged: false, bodyChanged: false },
    brandVoice: { toneChanged: false, taglinesAdded: [], taglinesRemoved: [] },
    logoDirection: { conceptChanged: false, elementsAdded: [], elementsRemoved: [] },
    hasChanges: false
  };
  
  // Compare colors
  const oldColorHexes = new Set(oldKit.colors.map(c => c.hex));
  const newColorHexes = new Set(newKit.colors.map(c => c.hex));
  
  newKit.colors.forEach(color => {
    if (!oldColorHexes.has(color.hex)) {
      diff.colors.added.push(color);
    }
  });
  
  oldKit.colors.forEach(color => {
    if (!newColorHexes.has(color.hex)) {
      diff.colors.removed.push(color);
    }
  });
  
  // Check for colors with same hex but different properties
  oldKit.colors.forEach(oldColor => {
    const newColor = newKit.colors.find(c => c.hex === oldColor.hex);
    if (newColor && (newColor.name !== oldColor.name || newColor.usage !== oldColor.usage)) {
      diff.colors.changed.push({ old: oldColor, new: newColor });
    }
  });
  
  // Compare fonts
  if (oldKit.fonts.heading.name !== newKit.fonts.heading.name) {
    diff.fonts.headingChanged = true;
    diff.fonts.oldHeading = oldKit.fonts.heading.name;
    diff.fonts.newHeading = newKit.fonts.heading.name;
  }
  
  if (oldKit.fonts.body.name !== newKit.fonts.body.name) {
    diff.fonts.bodyChanged = true;
    diff.fonts.oldBody = oldKit.fonts.body.name;
    diff.fonts.newBody = newKit.fonts.body.name;
  }
  
  // Compare brand voice
  if (oldKit.brandVoice.tone !== newKit.brandVoice.tone) {
    diff.brandVoice.toneChanged = true;
    diff.brandVoice.oldTone = oldKit.brandVoice.tone;
    diff.brandVoice.newTone = newKit.brandVoice.tone;
  }
  
  const oldTaglines = new Set(oldKit.brandVoice.taglines);
  const newTaglines = new Set(newKit.brandVoice.taglines);
  
  newKit.brandVoice.taglines.forEach(t => {
    if (!oldTaglines.has(t)) diff.brandVoice.taglinesAdded.push(t);
  });
  
  oldKit.brandVoice.taglines.forEach(t => {
    if (!newTaglines.has(t)) diff.brandVoice.taglinesRemoved.push(t);
  });
  
  // Compare logo direction
  if (oldKit.logoDirection.concept !== newKit.logoDirection.concept) {
    diff.logoDirection.conceptChanged = true;
    diff.logoDirection.oldConcept = oldKit.logoDirection.concept;
    diff.logoDirection.newConcept = newKit.logoDirection.concept;
  }
  
  const oldElements = new Set(oldKit.logoDirection.elements);
  const newElements = new Set(newKit.logoDirection.elements);
  
  newKit.logoDirection.elements.forEach(e => {
    if (!oldElements.has(e)) diff.logoDirection.elementsAdded.push(e);
  });
  
  oldKit.logoDirection.elements.forEach(e => {
    if (!newElements.has(e)) diff.logoDirection.elementsRemoved.push(e);
  });
  
  // Check if there are any changes
  diff.hasChanges = 
    diff.colors.added.length > 0 ||
    diff.colors.removed.length > 0 ||
    diff.colors.changed.length > 0 ||
    diff.fonts.headingChanged ||
    diff.fonts.bodyChanged ||
    diff.brandVoice.toneChanged ||
    diff.brandVoice.taglinesAdded.length > 0 ||
    diff.brandVoice.taglinesRemoved.length > 0 ||
    diff.logoDirection.conceptChanged ||
    diff.logoDirection.elementsAdded.length > 0 ||
    diff.logoDirection.elementsRemoved.length > 0;
  
  return diff;
};

/**
 * Get all unique businesses in the vault
 */
export const getAllBusinesses = (): string[] => {
  const vault = getVault();
  const businesses = new Set(vault.versions.map(v => v.businessName));
  return Array.from(businesses);
};

/**
 * Get version count for a business
 */
export const getVersionCount = (businessName: string): number => {
  return getVersionsForBusiness(businessName).length;
};

/**
 * Format a date for display
 */
export const formatVersionDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};
