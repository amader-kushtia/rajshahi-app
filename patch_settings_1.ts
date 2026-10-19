import fs from 'fs';
let content = fs.readFileSync('src/components/admin/SystemSettingsTab.tsx', 'utf-8');

// 1. Add 'features' to activeSubTab state type
content = content.replace(
  "useState<'general' | 'notice' | 'helpline' | 'theme' | 'security' | 'backup'>(defaultSubTab);",
  "useState<'general' | 'features' | 'notice' | 'helpline' | 'theme' | 'security' | 'backup'>(defaultSubTab);"
);

// 2. Add featuresForm state
content = content.replace(
  "  // Notice Form",
  "  // Features Form\n  const [featuresForm, setFeaturesForm] = useState<string[]>(appTheme.disabledFeatures || []);\n\n  // Notice Form"
);

fs.writeFileSync('src/components/admin/SystemSettingsTab.tsx', content);
