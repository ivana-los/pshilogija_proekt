const HABITS = [
    { icon: '🏃', name: 'Physical activity (30 min)' },
    { icon: '💧', name: '8 glasses of water' },
    { icon: '🥗', name: 'Healthy meal' },
    { icon: '📚', name: 'Reading / studying' },
    { icon: '🌿', name: 'Phone-free break' },
    { icon: '🧘', name: 'Relaxation / meditation' },
    { icon: '💤', name: '8h of sleep tonight' },
    { icon: '🤝', name: 'Talk to a friend' },
];


function renderHabits() {
    const today = new Date().toISOString().split('T')[0];
    if (!state.habits[today]) state.habits[today] = new Array(HABITS.length).fill(false);
    const todayHabits = state.habits[today];

    document.getElementById('habitsGrid').innerHTML = HABITS.map((h, i) => `
    <div class="habit-card ${todayHabits[i] ? 'done' : ''}" onclick="toggleHabit(${i})">
      <div class="habit-icon">${h.icon}</div>
      <div class="habit-name">${h.name}</div>
      <div class="habit-check">${todayHabits[i] ? '✓' : ''}</div>
    </div>
  `).join('');

    const done = todayHabits.filter(Boolean).length;
    document.getElementById('habitProgress').textContent = done + ' / ' + HABITS.length;
    document.getElementById('habitBar').style.width      = (done / HABITS.length * 100) + '%';
    document.getElementById('habitsToday').textContent   = done + '/' + HABITS.length;
}


function toggleHabit(idx) {
    const today = new Date().toISOString().split('T')[0];
    if (!state.habits[today]) state.habits[today] = new Array(HABITS.length).fill(false);
    state.habits[today][idx] = !state.habits[today][idx];
    save();
    renderHabits();
    if (state.habits[today].every(Boolean)) showToast('Amazing! You completed all habits! 🏆');
}