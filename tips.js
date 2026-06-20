const TIPS_DATA = [
    { cat: 'mental',   icon: '🧠', title: '4-7-8 Breathing',             text: 'Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 3 times. Scientifically proven to reduce stress in under a minute.' },
    { cat: 'physical', icon: '🏃', title: '30 minutes of movement',       text: 'HBSC research shows that just 30 min of activity a day significantly improves mood in teenagers. No gym needed – a walk counts too!' },
    { cat: 'sleep',    icon: '💤', title: 'Regular sleep schedule',        text: 'Go to bed and wake up at the same time every day, even on weekends. Recommended for ages 13–15: 8–10 hours.' },
    { cat: 'digital',  icon: '📱', title: 'The 20-20-20 rule',            text: 'Every 20 minutes on a screen, look at something 20 metres away for 20 seconds. Protects your eyes and reduces headaches.' },
    { cat: 'social',   icon: '👥', title: 'Quality vs. quantity',          text: 'It\'s better to have 2–3 real friends than 200 acquaintances. HBSC shows that deep connections are key to wellbeing.' },
    { cat: 'mental',   icon: '✏️', title: 'Gratitude journal',            text: 'Every evening write down 3 things you\'re grateful for. After 21 days your brain naturally starts looking for positives.' },
    { cat: 'physical', icon: '🥗', title: 'Food and mood',                 text: 'Sugar gives a short energy burst followed by a mood crash. Try nuts, a banana, or fruit instead of sweets.' },
    { cat: 'sleep',    icon: '🌙', title: 'Phone out of the bedroom',      text: 'Blue light blocks melatonin. Leave your phone outside the room 1 hour before bed.' },
    { cat: 'digital',  icon: '⏰', title: 'Digital detox',                text: 'Once a week, try half a day without social media. HBSC links excessive use to increased anxiety.' },
    { cat: 'social',   icon: '🗣️', title: 'Say when things are hard',     text: 'Talking about your problems isn\'t weakness – it gives others the chance to help.' },
    { cat: 'mental',   icon: '🎯', title: 'Small goals every day',         text: 'Instead of one big goal, set 1–3 small tasks for today. Each completion releases dopamine and builds confidence.' },
    { cat: 'physical', icon: '🧘', title: 'Progressive relaxation',        text: 'Tense and release each muscle in turn, from your toes to the top of your head. 10 minutes before bed puts your body into rest mode.' },
];


function renderTips(filter = 'all') {
    const tips = filter === 'all' ? TIPS_DATA : TIPS_DATA.filter(t => t.cat === filter);
    document.getElementById('tipsContainer').innerHTML = tips.map(t => `
    <div class="tip-card">
      <div class="tip-category">${t.icon} ${t.cat}</div>
      <div style="font-weight:600;margin-bottom:4px;">${t.title}</div>
      <div style="color:var(--text);font-size:13px;">${t.text}</div>
    </div>
  `).join('');
}


function filterTips(cat, el) {
    document.querySelectorAll('#tipFilters .btn').forEach(b => {
        b.style.borderColor = '';
        b.style.color       = '';
    });
    el.style.borderColor = 'var(--purple)';
    el.style.color       = 'var(--purple)';
    renderTips(cat);
}