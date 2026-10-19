import fs from 'fs';
let content = fs.readFileSync('src/components/admin/SystemSettingsTab.tsx', 'utf-8');

const newTabButton = `
        <button
          onClick={() => setActiveSubTab('features')}
          className={\`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 \${
            activeSubTab === 'features'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }\`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ফিচার কন্ট্রোল</span>
        </button>
        <button
          onClick={() => setActiveSubTab('notice')}
`;

content = content.replace(
  "        <button\n          onClick={() => setActiveSubTab('notice')}",
  newTabButton
);

fs.writeFileSync('src/components/admin/SystemSettingsTab.tsx', content);
