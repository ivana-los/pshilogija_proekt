
var STRESS_QS = [
    {
        q: 'How often in the last 2 weeks have you felt under pressure?',
        opts: ['Almost never', 'Sometimes', 'Often', 'Almost always']
    },
    {
        q: 'Do you have trouble sleeping because of worries?',
        opts: ['No', 'Rarely', 'Sometimes', 'Every day']
    },
    {
        q: 'How much do homework and school stress you out?',
        opts: ['Not at all', 'A little', 'Moderately', 'A lot']
    },
    {
        q: 'Do you feel lonely or isolated?',
        opts: ['Almost never', 'Sometimes', 'Often', 'Almost always']
    },
    {
        q: 'How hard is it for you to concentrate?',
        opts: ['No problem', 'A little hard', 'Quite hard', 'Very hard']
    },
    {
        q: 'How much do you enjoy activities that used to be fun?',
        opts: ['A lot', 'Moderately', 'A little', 'Not at all']
    },
];


function renderStressQuestions() {
    var container = document.getElementById('stressQuestions');
    if (!container) return;
    container.innerHTML = STRESS_QS.map(function(q, qi) {
        return '<div class="stress-q">' +
            '<p>' + (qi + 1) + '. ' + q.q + '</p>' +
            '<div class="stress-options">' +
            q.opts.map(function(o, oi) {
                return '<span class="stress-opt" onclick="selectStressOpt(this,' + qi + ')" data-val="' + oi + '">' + o + '</span>';
            }).join('') +
            '</div></div>';
    }).join('');
}


function selectStressOpt(el, qi) {
    el.closest('.stress-options').querySelectorAll('.stress-opt').forEach(function(o) {
        o.classList.remove('sel');
    });
    el.classList.add('sel');
}


function calcStress() {
    var qs = document.querySelectorAll('.stress-q');
    var total = 0, answered = 0;

    qs.forEach(function(q) {
        var sel = q.querySelector('.stress-opt.sel');
        if (sel) {
            total += parseInt(sel.dataset.val);
            answered++;
        }
    });

    if (answered < STRESS_QS.length) {
        showToast('Please answer all questions!');
        return;
    }

    var max = STRESS_QS.length * 3;
    var pct = Math.round((total / max) * 100);

    var result = document.getElementById('stressResult');
    result.classList.add('show');

    var level, color, bg, tips;
    if (pct <= 30) {
        level = 'Low stress 🟢';
        color = '#16A34A';
        bg    = '#DCFCE7';
        tips  = '<p>Great! Your stress level is under control. Keep up the good habits:</p>' +
            '<ul class="tip-list">' +
            '<li>Maintain regular physical activity</li>' +
            '<li>Stay connected with friends</li>' +
            '<li>Keep getting enough sleep</li>' +
            '</ul>';
    } else if (pct <= 60) {
        level = 'Moderate stress 🟡';
        color = '#D97706';
        bg    = '#FEF3C7';
        tips  = '<p>You have some stress – that\'s normal! Try:</p>' +
            '<ul class="tip-list">' +
            '<li>Take a break every 45 minutes of studying</li>' +
            '<li>Do something nice for yourself every day</li>' +
            '<li>Talk to a friend or parent</li>' +
            '<li>Try 5 minutes of deep breathing</li>' +
            '</ul>';
    } else {
        level = 'High stress 🔴';
        color = '#DC2626';
        bg    = '#FEE2E6';
        tips  = '<p>Your stress level is elevated. It\'s important to seek support:</p>' +
            '<ul class="tip-list">' +
            '<li>Talk to a trusted adult</li>' +
            '<li>Limit time on social media</li>' +
            '<li>Accept that not everything has to be perfect</li>' +
            '<li>Consider talking to your school counselor</li>' +
            '<li>Make a priority list – you can\'t do everything at once</li>' +
            '</ul>';
    }

    result.style.background = bg;
    result.style.color      = color;
    document.getElementById('stressScore').textContent      = pct + '%';
    document.getElementById('stressLevelLabel').textContent = level;
    document.getElementById('stressTipsText').innerHTML     = tips;

    if (typeof state !== 'undefined' && typeof save === 'function') {
        state.lastStressTest = { date: new Date().toISOString(), pct: pct };
        save();
    }

    var lastStressEl = document.getElementById('lastStress');
    if (lastStressEl) lastStressEl.textContent = pct + '%';
}