import fs from 'fs';
let content = fs.readFileSync('src/pages/CategoriesOverviewPage.tsx', 'utf-8');

// Add import
if (!content.includes('useAdminConfig')) {
  content = content.replace(
    "import { CategoryType } from '../types';",
    "import { CategoryType } from '../types';\nimport { useAdminConfig } from '../context/AdminConfigContext';"
  );
}

// Extract disabledFeatures and filter categoryItems
const categoryReplacement = `
export const CategoriesOverviewPage: React.FC<CategoriesOverviewPageProps> = ({
  onSelectCategory,
}) => {
  const { themeConfig } = useAdminConfig();
  const disabled = themeConfig.disabledFeatures || [];
  
  const categoryItems = [
`;
content = content.replace("export const CategoriesOverviewPage: React.FC<CategoriesOverviewPageProps> = ({\n  onSelectCategory,\n}) => {\n  const categoryItems = [", categoryReplacement);

const mapReplacement = `{categoryItems.filter(cat => !disabled.includes(cat.id)).map((item) => {`;
content = content.replace("{categoryItems.map((item) => {", mapReplacement);

fs.writeFileSync('src/pages/CategoriesOverviewPage.tsx', content);
