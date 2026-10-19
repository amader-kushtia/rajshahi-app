import fs from 'fs';
let content = fs.readFileSync('src/components/admin/SystemSettingsTab.tsx', 'utf-8');

// 1. Add handleSaveFeatures
const handleSaveFeatures = `
  const handleSaveFeatures = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTheme({ disabledFeatures: featuresForm });
    addActivityLog({
      type: 'category_updated',
      title: 'ফিচার কন্ট্রোল আপডেট',
      description: 'অ্যাপের কোন কোন ফিচার অন/অফ থাকবে তা আপডেট করা হয়েছে।',
      actor: 'এডমিন'
    });
    showToast('ফিচার সেটিংস সফলভাবে আপডেট হয়েছে!');
  };
`;
content = content.replace(
  "  const handleSaveHelplines",
  handleSaveFeatures + "  const handleSaveHelplines"
);

fs.writeFileSync('src/components/admin/SystemSettingsTab.tsx', content);
