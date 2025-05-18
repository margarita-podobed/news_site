$(function () {
  const months = [
    'Aug, 24','Sep, 24','Oct, 24','Nov, 24','Dec, 24',
    'Jan, 24','Feb, 24','Mar, 24','Apr, 24','May, 24','Jun, 24'
  ];
  let active = 1;
  const $monthsList = $('.months-nav__list');

  function drawMonths() {
    $monthsList.empty();
    months.forEach((label, idx) => {
      const $btn = $(
        `<button class="month-btn"${idx === active ? ' aria-current="true"' : ''}>${label}</button>`
      );
      $btn.on('click keydown', e => {
        if (e.type === 'click' || e.key === 'Enter') {
          active = idx;
          updateAll();
        }
      });
      $monthsList.append($('<li>').append($btn));
    });
  }

  function scrollMonths(offset) {
    $monthsList[0].scrollBy({ left: offset, behavior: 'smooth' });
  }

  $('#month-prev').on('click keydown', e => {
    if ((e.type === 'click' || e.key === 'Enter') && active > 0) {
      active--;
      updateAll();
      scrollMonths(-$monthsList[0].clientWidth);
    }
  });

  $('#month-next').on('click keydown', e => {
    if ((e.type === 'click' || e.key === 'Enter') && active < months.length - 1) {
      active++;
      updateAll();
      scrollMonths( $monthsList[0].clientWidth);
    }
  });

  const gen = offset =>
    Array.from({ length: 31 }, (_, d) =>
      Math.round(((Math.sin((d + offset) / 3) + 1) * 0.5 + Math.random() * 0.3) * 1000)
    );
  let s1 = gen(3), s2 = gen(8);
  function updateStats() {
    $('#stat1').text(`${s1.reduce((a,b) => a+b)} GB`);
    $('#stat2').text(`${s2.reduce((a,b) => a+b)} GB`);
  }

  const verticalStripe = {
    id: 'verticalStripe',
    afterDraw: chart => {
      const act = chart.tooltip._active;
      if (act?.length) {
        const ctx = chart.ctx;
        const x = act[0].element.x;
        const { top, bottom } = chart.scales.y;
        ctx.save();
        ctx.fillStyle = 'rgba(128,128,128,0.15)';
        ctx.fillRect(x - 1, top, 2, bottom - top);
        ctx.restore();
      }
    }
  };
  let ch;
  function drawChart() {
    const ctx = $('#line-chart')[0].getContext('2d');
    if (ch) ch.destroy();
    ch = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 31 }, (_, i) => `${i+1} ${months[active].split(',')[0]}`),
        datasets: [
          { data: s1, borderColor: '#0534b7', backgroundColor: '#0534b7', tension: 0.3 },
          { data: s2, borderColor: '#b0111c', backgroundColor: '#b0111c', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 12 } },
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 1000,
            ticks: { callback: v => v/1000 + ' TB' },
            grid: { display: false },
            color: '#000'
          },
          x: {
            grid: { display: false },
            color: '#000'
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        }
      },
      plugins: [verticalStripe]
    });
  }

  function updateAll() {
    drawMonths();
    updateStats();
    drawChart();
  }

  updateAll();
});
