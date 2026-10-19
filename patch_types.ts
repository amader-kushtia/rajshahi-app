import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf-8');

// Add disabledFeatures array to AppThemeConfig
content = content.replace(
  "isMemberPostingAllowed?: boolean;",
  "isMemberPostingAllowed?: boolean;\n  disabledFeatures?: string[];"
);

fs.writeFileSync('src/types.ts', content);
