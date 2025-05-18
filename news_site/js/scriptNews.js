$(function() {
  const $tabs      = $('.tab');
  const $pages     = $('.page');
  const $featured  = $('#featured-story');
  const $topList   = $('.top-stories__list');
  const $cardsWrap = $('#latest-cards');
  const $btnMore   = $('#btn-more');
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  // Переключение табов
  $tabs.on('click keydown', e => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      const $btn   = $(e.currentTarget);
      const panel  = $btn.attr('aria-controls');

      $tabs.attr('aria-selected', 'false');
      $btn.attr('aria-selected', 'true');

      $pages.attr('hidden', true);
      const $activePage = $(`#${panel}`);
      $activePage
        .removeAttr('hidden')
        .attr('tabindex', '-1')
        .focus();

      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  });

  const HERO = 1, TOP = 4, CARD = 8;
  let posts = [], shown = 0;

  function renderFeatured(post) {
    try {
      $featured.find('.featured-story__title').text(capitalize(post.title));
      $featured.off('click').on('click', () =>
        window.open(`https://jsonplaceholder.typicode.com/posts/${post.id}`, '_blank')
      );
    } catch (err) {
      console.error('Error rendering featured story:', err);
      $featured.html('<p>Не удалось отобразить главную новость</p>');
    }
  }

  function renderTopStories(list) {
    try {
      $topList.empty();
      list.forEach(post => {
        $topList.append(`
          <li>
            <a class="top-story"
               href="https://jsonplaceholder.typicode.com/posts/${post.id}"
               target="_blank"
               rel="noopener">
              <h3 class="top-story__title">
                ${capitalize(post.title.slice(0,20))}…
              </h3>
              <p class="top-story__summary">
                ${capitalize(post.body.slice(0,80))}…
              </p>
              <p class="top-story__meta">2 hrs ago | Climate</p>
            </a>
          </li>
        `);
      });
    } catch (err) {
      console.error('Error rendering top stories:', err);
      $topList.html('<li>Не удалось загрузить список</li>');
    }
  }

  function addCards(list) {
    list.forEach(post => {
      try {
        const img = `https://picsum.photos/seed/${post.id}/490/280`;
        const $card = $(`
          <article class="card" tabindex="0">
            <img src="${img}"
                 alt="${capitalize(post.title)}"
                 loading="lazy">
            <h3 class="card__title">
              ${capitalize(post.title.slice(0,80))}
            </h3>
            <p class="card__summary">
              ${capitalize(post.body.slice(0,90))}…
            </p>
            <p class="card__meta">1 day ago | Culture</p>
          </article>
        `).on('click keydown', e => {
          if (e.type === 'click' || e.key === 'Enter') {
            window.open(
              `https://jsonplaceholder.typicode.com/posts/${post.id}`,
              '_blank'
            );
          }
        });
        $cardsWrap.append($card);
      } catch (err) {
        console.error('Error adding card for post', post.id, err);
      }
    });
  }

  // Загрузка данных
  $.getJSON('https://jsonplaceholder.typicode.com/posts?_limit=40')
    .done(data => {
      if (!Array.isArray(data) || !data.length) {
        throw new Error('Пустой ответ от сервера');
      }
      posts = data;
      renderFeatured(posts[0]);
      renderTopStories(posts.slice(HERO, HERO + TOP));
      addCards(posts.slice(HERO + TOP, HERO + TOP + CARD));
      shown = CARD;
    })
    .fail((jqxhr, textStatus, error) => {
      console.error('Fetch error:', textStatus, error);
      $featured.html('<p>Не удалось загрузить главную новость</p>');
      $topList.html('<li>Не удалось загрузить список</li>');
      $cardsWrap.html('<p>Не удалось загрузить новости</p>');
      $btnMore.hide();
    });

  // Показать ещё
  $btnMore.on('click', () => {
    try {
      const next = posts.slice(HERO + TOP + shown, HERO + TOP + shown + CARD);
      if (!next.length) return $btnMore.hide();
      addCards(next);
      shown += next.length;
      if (shown >= posts.length - (HERO + TOP)) {
        $btnMore.hide();
      }
    } catch (err) {
      console.error('Error loading more cards:', err);
    }
  });
});
