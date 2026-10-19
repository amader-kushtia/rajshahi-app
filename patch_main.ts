import fs from 'fs';
let content = fs.readFileSync('src/main.tsx', 'utf-8');

content = content.replace(
  "import App from './App.tsx';",
  "import App from './App.tsx';\nimport { AdminConfigProvider } from './context/AdminConfigContext';"
);

content = content.replace(
  "<App />",
  "<AdminConfigProvider>\n      <App />\n    </AdminConfigProvider>"
);

fs.writeFileSync('src/main.tsx', content);
