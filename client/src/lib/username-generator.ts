const PREFIXES = [
  "cipher", "phantom", "shadow", "ghost", "crypto", "stealth", "ninja", "viper",
  "raven", "falcon", "storm", "matrix", "nexus", "void", "echo", "omega",
  "alpha", "beta", "gamma", "delta", "sigma", "theta", "zero", "one",
  "binary", "hex", "byte", "node", "core", "flux", "dark", "black",
  "cyber", "neon", "pulse", "spark", "bolt", "flash", "swift", "quick"
];

export function generateUsername(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const number = Math.floor(Math.random() * 9999) + 1;
  return `${prefix}#${number.toString().padStart(4, '0')}`;
}

export function generateSessionId(): string {
  return Array.from({ length: 8 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}
