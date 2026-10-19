import fs from 'fs';
let content = fs.readFileSync('src/context/AdminConfigContext.tsx', 'utf-8');

// Add Firestore onSnapshot for app_config
if (!content.includes("onSnapshot(doc(db, 'admin_config', 'global')")) {
  const replacement = `
  useEffect(() => {
    // Sync AppThemeConfig from Firestore so it affects all users
    import('firebase/firestore').then(({ doc, onSnapshot }) => {
      const unsub = onSnapshot(doc(db, 'admin_config', 'global'), (snap) => {
        if (snap.exists()) {
          setThemeConfig(prev => ({ ...prev, ...snap.data() as any }));
        }
      });
      return () => unsub();
    });

    fetchRealUserCount();
`;
  content = content.replace("  useEffect(() => {\n    fetchRealUserCount();", replacement);
}

fs.writeFileSync('src/context/AdminConfigContext.tsx', content);
