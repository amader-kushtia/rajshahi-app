import fs from 'fs';
let content = fs.readFileSync('src/components/admin/SystemSettingsTab.tsx', 'utf-8');

const effectCode = `
  useEffect(() => {
    setFeaturesForm(appTheme.disabledFeatures || []);
  }, [appTheme.disabledFeatures]);

  const handleSaveFeatures = (e: React.FormEvent) => {
`;

content = content.replace("  const handleSaveFeatures = (e: React.FormEvent) => {", effectCode);
fs.writeFileSync('src/components/admin/SystemSettingsTab.tsx', content);
