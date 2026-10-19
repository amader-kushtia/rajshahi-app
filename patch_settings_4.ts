import fs from 'fs';
let content = fs.readFileSync('src/components/admin/SystemSettingsTab.tsx', 'utf-8');

const newTabContent = `
      {/* 1.1 FEATURES SETTINGS */}
      {activeSubTab === 'features' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">ফিচার কন্ট্রোল (Feature Toggles)</h3>
              <p className="text-xs text-slate-500">
                যেকোনো সার্ভিস বা ক্যাটাগরি যেকোনো সময় অন বা অফ করুন। অফ করা ফিচার ইউজাররা দেখতে পারবে না।
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveFeatures} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'house-rent', label: 'বাসা ভাড়া' },
                { id: 'buy-sell', label: 'বাই-সেল' },
                { id: 'doctor', label: 'ডাক্তার' },
                { id: 'blood', label: 'রক্তদাতা' },
                { id: 'crime-reporter', label: 'গোপন তথ্য' },
                { id: 'food', label: 'রেস্টুরেন্ট ও খাবার' },
                { id: 'transport', label: 'বাস ও ট্রেন' },
                { id: 'jobs', label: 'চাকরি ও নিয়োগ' },
                { id: 'lost-found', label: 'হারানো ও প্রাপ্তি' },
                { id: 'legal', label: 'আইনি সহায়তা' },
                { id: 'events', label: 'অনুষ্ঠান ও ডেকোর' },
                { id: 'electrician', label: 'ইলেকট্রিশিয়ান' },
                { id: 'plumber', label: 'প্লাম্বার' },
                { id: 'ac-mechanic', label: 'এসি/ফ্রিজ' },
                { id: 'driver', label: 'ড্রাইভার' },
                { id: 'tutor', label: 'টিউশন/শিক্ষক' },
                { id: 'vet', label: 'পশু চিকিৎসক' },
                { id: 'mason', label: 'রাজমিস্ত্রি' },
                { id: 'mobile-maker', label: 'মোবাইল মেকার' },
              ].map(feature => {
                const isEnabled = !featuresForm.includes(feature.id);
                return (
                  <div key={feature.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700">{feature.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isEnabled) {
                          setFeaturesForm([...featuresForm, feature.id]); // Add to disabled
                        } else {
                          setFeaturesForm(featuresForm.filter(f => f !== feature.id)); // Remove from disabled
                        }
                      }}
                      className={\`relative w-10 h-5 rounded-full transition-colors focus:outline-none \${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}\`}
                    >
                      <div className={\`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform \${isEnabled ? 'translate-x-5' : 'translate-x-0'}\`} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 1. GENERAL SETTINGS */}
`;

content = content.replace(
  "      {/* 1. GENERAL SETTINGS */}",
  newTabContent
);

fs.writeFileSync('src/components/admin/SystemSettingsTab.tsx', content);
