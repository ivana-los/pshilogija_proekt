
var state = JSON.parse(localStorage.getItem('moodlens') || '{}');
if (!state.entries)        state.entries        = [];
if (!state.habits)         state.habits         = {};
if (!state.streak)         state.streak         = 0;
if (!state.lastStressTest) state.lastStressTest = null;

var selectedMood = null;
var selectedTags = [];

var MOODS       = ['😢','😕','😐','🙂','😄'];
var MOOD_LABELS = ['Very bad','Not great','Okay','Good','Great'];


function save() {
    localStorage.setItem('moodlens', JSON.stringify(state));
}


function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2800);
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    document.getElementById('page-' + id).classList.add('active');

    var tabs = document.querySelectorAll('.nav-tab');
    var idx  = ['home','stress','habits','tips','history'].indexOf(id);
    if (tabs[idx]) tabs[idx].classList.add('active');

    if (id === 'history') renderHistory();
    if (id === 'home')    { renderChart(); renderStats(); }
    if (id === 'habits')  renderHabits();

    if (id === 'stress') {
        renderStressQuestions();
        var result = document.getElementById('stressResult');
        if (result) result.classList.remove('show');
    }
}


function selectMood(el, val) {
    document.querySelectorAll('.mood-btn').forEach(function(b) { b.classList.remove('selected'); });
    el.classList.add('selected');
    selectedMood = val;
}

function toggleTag(el, tag) {
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(function(t) { return t !== tag; });
        el.style.fontWeight = '500';
        el.style.boxShadow  = 'none';
    } else {
        selectedTags.push(tag);
        el.style.fontWeight = '700';
        el.style.boxShadow  = '0 0 0 2px var(--purple)';
    }
}


function saveEntry() {
    if (!selectedMood) { showToast('Please select a mood first! 😊'); return; }

    var sleep  = parseFloat(document.getElementById('sleepSlider').value);
    var energy = parseInt(document.getElementById('energySlider').value);
    var stress = parseInt(document.getElementById('stressSlider').value);
    var note   = document.getElementById('noteInput').value.trim();
    var today  = localDateStr(new Date());

    state.entries = state.entries.filter(function(e) { return e.date !== today; });
    state.entries.push({
        date: today, mood: selectedMood,
        sleep: sleep, energy: energy, stress: stress,
        note: note, tags: selectedTags.slice()
    });

    updateStreak();
    save();
    renderChart();
    renderStats();
    showToast('Saved! Keep it up! 🎉');

    selectedMood = null;
    selectedTags = [];
    document.querySelectorAll('.mood-btn').forEach(function(b) { b.classList.remove('selected'); });
    document.querySelectorAll('#tagArea .tag').forEach(function(t) {
        t.style.fontWeight = '500';
        t.style.boxShadow  = 'none';
    });
    document.getElementById('noteInput').value = '';
}


function localDateStr(d) {
    var y   = d.getFullYear();
    var m   = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
}

function updateStreak() {
    var dates = new Set(state.entries.map(function(e) { return e.date; }));
    var streak = 0;
    var d = new Date();

    var todayStr      = localDateStr(d);
    var hasTodayEntry = dates.has(todayStr);
    if (!hasTodayEntry) d.setDate(d.getDate() - 1);

    for (var i = 0; i < 365; i++) {
        var ds = localDateStr(d);
        if (dates.has(ds)) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }

    if (hasTodayEntry) streak = Math.max(streak, 1);
    state.streak = streak;
    document.getElementById('streakCount').textContent = streak;
}


function renderChart() {
    var chart = document.getElementById('moodChart');
    if (!chart) return;
    var days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var today = new Date();
    var cols  = [];

    for (var i = 6; i >= 0; i--) {
        var d     = new Date(today); d.setDate(d.getDate() - i);
        var ds    = localDateStr(d);
        var entry = state.entries.find(function(e) { return e.date === ds; });
        var day   = d.getDay() === 0 ? 6 : d.getDay() - 1;
        cols.push({ label: days[day], val: entry ? entry.mood : null });
    }

    var colors = ['#EF4444','#F97316','#EAB308','#22C55E','#8B5CF6'];
    chart.innerHTML = cols.map(function(c) {
        var pct   = c.val ? (c.val / 5) * 100 : 0;
        var color = c.val ? colors[c.val - 1] : '#E5E7EB';
        var emoji = c.val ? MOODS[c.val - 1] : '';
        return '<div class="chart-bar-col">' +
            '<div style="font-size:14px;margin-bottom:4px;">' + emoji + '</div>' +
            '<div class="chart-bar" style="height:' + pct + '%;background:' + color + ';width:100%;"></div>' +
            '<div class="chart-day">' + c.label + '</div>' +
            '</div>';
    }).join('');
}


function renderStats() {
    var today       = new Date();
    var weekEntries = state.entries.filter(function(e) {
        var entryDate = new Date(e.date + 'T00:00:00');
        return (today - entryDate) < 7 * 86400000;
    });

    document.getElementById('weekEntries').textContent = weekEntries.length;

    if (weekEntries.length > 0) {
        var avg = weekEntries.reduce(function(s, e) { return s + e.mood; }, 0) / weekEntries.length;
        document.getElementById('avgMood').textContent = MOODS[Math.round(avg) - 1];
    }

    var lastStressEl = document.getElementById('lastStress');
    if (lastStressEl) {
        if (state.lastStressTest && state.lastStressTest.pct !== undefined) {
            lastStressEl.textContent = state.lastStressTest.pct + '%';
        } else {
            lastStressEl.textContent = '–';
        }
    }

    document.getElementById('streakCount').textContent = state.streak;
}


function renderHistory() {
    var container = document.getElementById('historyContainer');
    if (state.entries.length === 0) {
        container.innerHTML = '<div class="empty"><div class="empty-icon">📖</div><div class="empty-text">No entries yet. Start logging your mood!</div></div>';
        return;
    }
    var sorted = state.entries.slice().sort(function(a, b) { return b.date.localeCompare(a.date); });
    container.innerHTML = sorted.map(function(e) {
        var d       = new Date(e.date + 'T00:00:00');
        var dateStr = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
        var tags    = (e.tags || []).map(function(t) {
            return '<span class="tag" style="background:var(--purple-light);color:var(--purple);">' + t + '</span>';
        }).join('');
        return '<div class="history-entry">' +
            '<div class="history-emoji">' + MOODS[e.mood - 1] + '</div>' +
            '<div style="flex:1;">' +
            '<div class="history-date">' + dateStr + ' · Stress: ' + e.stress + '/10 · Sleep: ' + e.sleep + 'h · Energy: ' + e.energy + '/10</div>' +
            (e.note ? '<div class="history-note">' + e.note + '</div>' : '') +
            (tags   ? '<div class="history-tags">'  + tags  + '</div>' : '') +
            '</div>' +
            '<div style="font-size:12px;color:var(--text-muted);">' + MOOD_LABELS[e.mood - 1] + '</div>' +
            '</div>';
    }).join('');
}


function renderDailyTip() {
    if (typeof TIPS_DATA === 'undefined') return;
    var idx = new Date().getDate() % TIPS_DATA.length;
    var t   = TIPS_DATA[idx];
    document.getElementById('dailyTipText').innerHTML =
        '<strong>' + t.icon + ' ' + t.title + '</strong><br>' + t.text;
}