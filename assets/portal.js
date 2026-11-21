(() => {
  'use strict';
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('.game-card'));
  const search = document.getElementById('game-search');
  const count = document.getElementById('visible-count');
  const empty = document.getElementById('empty-state');
  let active = 'todos';
  function normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function update() {
    const q = normalize(search.value);
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = active === 'todos' || card.dataset.category === active;
      const matchesSearch = normalize(card.dataset.search).includes(q);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    count.textContent = String(visible);
    empty.hidden = visible !== 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter;
    buttons.forEach(b => { const selected = b === button; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); });
    update();
  }));
  search.addEventListener('input', update);
  update();
})();
