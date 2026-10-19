import fs from 'fs';
let content = fs.readFileSync('src/services/adminService.ts', 'utf-8');

const replacement = `
export function saveAppThemeConfig(config: Partial<AppThemeConfig>): AppThemeConfig {
  const current = getAppThemeConfig();
  const updated: AppThemeConfig = { ...current, ...config };
  try {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updated));
    // Push to Firestore asynchronously
    setDoc(doc(db, 'admin_config', 'global'), updated, { merge: true }).catch(err => console.warn(err));

    if (typeof window !== 'undefined') {
`;
content = content.replace("export function saveAppThemeConfig(config: Partial<AppThemeConfig>): AppThemeConfig {\n  const current = getAppThemeConfig();\n  const updated: AppThemeConfig = { ...current, ...config };\n  try {\n    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updated));\n    if (typeof window !== 'undefined') {", replacement);

fs.writeFileSync('src/services/adminService.ts', content);
