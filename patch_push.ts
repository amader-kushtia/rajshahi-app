import fs from 'fs';

let content = fs.readFileSync('src/utils/pushNotification.ts', 'utf-8');

// 1. Add soundType to EmergencyBroadcastPayload
content = content.replace(
  "tag?: string;\n}",
  "tag?: string;\n  soundType?: string;\n}"
);

// 2. Replace playEmergencyChime
const newPlayEmergencyChime = `export function playEmergencyChime(type: EmergencyBroadcastPayload['type'] | string = 'emergency', customSound?: string) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    const soundToPlay = customSound || type;

    if (soundToPlay === 'sound1') {
      // 1. Soft Bell
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now); // G5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc1.start(now);
      osc1.stop(now + 1.2);
    } else if (soundToPlay === 'sound2') {
      // 2. Sweet Ring
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1046.50, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
      gain.gain.setValueAtTime(0.3, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc1.start(now);
      osc1.stop(now + 0.8);
    } else if (soundToPlay === 'sound3') {
      // 3. Alert Tone
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.setValueAtTime(440, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      gain.gain.setValueAtTime(0.15, now + 0.15);
      gain.gain.linearRampToValueAtTime(0, now + 0.25);
      osc1.start(now);
      osc1.stop(now + 0.25);
    } else if (soundToPlay === 'sound4') {
      // 4. Double Chime (Weather/Electricity)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.18); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.36); // G5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc1.start(now);
      osc1.stop(now + 0.7);
    } else if (soundToPlay === 'sound5') {
      // 5. Magic Dust
      osc1.type = 'sine';
      [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, i) => {
        osc1.frequency.setValueAtTime(freq, now + i * 0.08);
      });
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc1.start(now);
      osc1.stop(now + 0.5);
    } else if (soundToPlay === 'sound6') {
      // 6. Success Pop
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc1.start(now);
      osc1.stop(now + 0.2);
    } else if (soundToPlay === 'sound7') {
      // 7. Urgent Siren
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.36);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.54);
      osc2.frequency.setValueAtTime(587, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } else if (soundToPlay === 'sound8') {
      // 8. Deep Echo
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, now); // E4
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc1.start(now);
      osc1.stop(now + 1.5);
    } else if (soundToPlay === 'sound9') {
      // 9. Marimba
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.start(now);
      osc1.stop(now + 0.15);
    } else if (soundToPlay === 'sound10') {
      // 10. Simple Ping
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.50, now); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc1.start(now);
      osc1.stop(now + 0.3);
    } else if (soundToPlay === 'blood' || soundToPlay === 'emergency') {
      // Legacy fallback
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.36);
      osc2.frequency.setValueAtTime(587, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } else if (soundToPlay === 'electricity' || soundToPlay === 'weather') {
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.18);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      osc1.start(now);
      osc1.stop(now + 0.55);
    } else {
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.start(now);
      osc1.stop(now + 0.4);
    }
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}`;

const oldPlayEmergencyChimeRegex = /export function playEmergencyChime[\s\S]*?console\.warn\('Audio chime notice:', err\);\n  }\n}/;
content = content.replace(oldPlayEmergencyChimeRegex, newPlayEmergencyChime);

// 3. Ensure showEmergencyPushNotification uses the customSound
content = content.replace(
  "playEmergencyChime(payload.type);",
  "playEmergencyChime(payload.type, payload.soundType);"
);

fs.writeFileSync('src/utils/pushNotification.ts', content);
