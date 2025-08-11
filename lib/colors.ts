export const COLORS = {
  background: '#F5F2FF',    // Light lavender background
  primaryPurple: '#6A1B9A', // Buttons, headings
  secondaryPurple: '#9575CD', // Card backgrounds, nav
  accentPink: '#F48FB1',    // Hover, highlights
  textDark: '#2E1A47',      // Main text
  textMuted: '#5E4A7D'      // Secondary text
} as const;

// Helper function to get CSS custom properties
export const getColorCSSVariables = () => ({
  '--background': COLORS.background,
  '--primary-purple': COLORS.primaryPurple,
  '--secondary-purple': COLORS.secondaryPurple,
  '--accent-pink': COLORS.accentPink,
  '--text-dark': COLORS.textDark,
  '--text-muted': COLORS.textMuted,
});
