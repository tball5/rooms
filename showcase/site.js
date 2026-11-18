/* Shaden Tech showcase.
   Only one room runs at a time: switching rooms fully shuts down the one before (frees its graphics
   memory) before the next one loads. To add a room, add an entry to ROOMS below. */

// ---- your settings -------------------------------------------------------------------------------
const SITE = {
  // Where requests go. With formEndpoint set (e.g. a Formspree address), the form sends straight to you.
  // Without it, the form opens the visitor's email app addressed to contactEmail.
  contactEmail: 'hello@example.com',   // TODO: the real Shaden Tech address
  formEndpoint: '',                    // TODO: Formspree form address, e.g. 'https://formspree.io/f/xxxxxxx'
};

// "Built by Shaden": games and builds that show we make whole worlds, not just templates.
// The section (and its menu and footer links) stays hidden until there's at least one entry here
// or a Nexus link. preview: an image in showcase/builds/, about 16:10.
const BUILDS = [
  // TODO: T to supply names, links and preview images, e.g.
  // { name: 'Game name', kind: 'Arcade game', line: 'One line about it.', url: 'https://…', preview: 'showcase/builds/game.jpg' },
  // { name: 'Temple name', kind: 'Temple build', line: 'One line about it.', url: 'https://…', preview: 'showcase/builds/temple.jpg' },
];
const NEXUS_URL = '';                  // TODO: link to the Nexus city

const ROOMS = [
  {
    id: 'lofi-bedroom', name: 'Lofi Bedroom', path: 'rooms/lofi-bedroom/', preview: 'showcase/previews/lofi-bedroom.jpg',
    kicker: 'For lofi artists, producers and streamers',
    line: 'A rainy-night bedroom with a real 3D city outside the window. Her computer plays your tracks.',
    features: ['Your songs on her computer', 'Posters, neon sign and colours', 'Her and the cat, restyled'],
    tip: 'Tap the computer, the cat and the window',
  },
  {
    id: 'the-basement', name: 'The Basement', path: 'rooms/the-basement/', preview: 'showcase/previews/the-basement.jpg',
    kicker: 'For bands and garage projects',
    line: 'The band\'s concrete jam space. Visitors play the drums, the guitar and the loop pedal themselves.',
    features: ['Playable drums, guitar and loop pedal', 'Your band members, as characters', 'Flyers and posters on the walls'],
    tip: 'Tap the drums, the guitar and the amp to play them',
  },
  {
    id: 'dj-set', name: 'DJ Set', path: 'rooms/dj-set/', preview: 'showcase/previews/dj-set.jpg',
    kicker: 'For DJs, clubs and labels',
    line: 'A small house club at night: a DJ on the decks, lasers, a mirror ball, and a drop the whole room feels.',
    features: ['Your DJ in the booth', 'Your venue name in neon', 'Your mixes on the decks'],
    tip: 'Tap ▶ on the player to start the set',
  },
  {
    id: 'live-concert', name: 'Live Concert', path: 'rooms/live-concert/', preview: 'showcase/previews/live-concert.jpg',
    kicker: 'For bands, festivals and release nights',
    line: 'Headline a festival main stage at night. A packed field, lights that hit with the music, and a stage dive.',
    features: ['Your band on the main stage', 'Screens, merch tent and lineup', 'A crowd that reacts to the show'],
    tip: 'Tap ▶ on the player to start the show',
  },
];

// ---- the viewer -------------------------------------------------------------------------------------
const $ = id => document.getElementById(id);
const viewer = $('viewer'), poster = $('poster'), loading = $('loading');
const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
let current = ROOMS[0], frame = null, live = false;

// Online, a folder address opens its index.html by itself. Opened straight from your computer
// (file://), the browser would just list the folder, so point at the file itself.
const LOCAL = location.protocol === 'file:';
const roomUrl = path => (LOCAL && path && path.endsWith('/')) ? path + 'index.html' : path;
if (LOCAL) for (const a of document.querySelectorAll('a[href^="rooms/"]')) a.href = roomUrl(a.getAttribute('href'));

if (IS_TOUCH) $('hint').textContent = 'Drag to look · joystick to walk · tap + on the player to add your own song';

const tabs = document.querySelector('.tabs');
for (const room of ROOMS) {
  const b = document.createElement('button');
  b.className = 'tab'; b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.id = room.id;
  b.innerHTML = room.name + (room.soon ? '<span class="soon">SOON</span>' : '');
  b.addEventListener('click', () => select(room.id, live));
  tabs.append(b);
}

function unload() {
  if (!frame) return;
  try { frame.contentWindow.room?.dispose?.(); } catch {}        // stop it and free its graphics memory
  frame.src = 'about:blank';
  frame.remove();
  frame = null;
}

function select(id, enterNow = false) {
  const room = ROOMS.find(r => r.id === id) || ROOMS[0];
  unload();
  live = false;
  current = room;
  for (const t of tabs.children) t.setAttribute('aria-selected', String(t.dataset.id === room.id));
  // on a phone the tab row scrolls sideways: keep the picked room's tab in view (without moving the page)
  const on = [...tabs.children].find(t => t.dataset.id === room.id);
  if (on && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = Math.max(0, on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2);
  poster.hidden = false; loading.hidden = true;
  poster.classList.toggle('soon', !!room.soon);
  $('posterImg').src = room.preview || ROOMS[2].preview;
  $('posterImg').alt = room.soon ? '' : room.name;
  $('posterKicker').textContent = room.kicker;
  $('posterName').textContent = room.name;
  $('posterLine').textContent = room.line;
  // phones: the same words, plus how to get around, under the window
  $('notesLine').textContent = room.line;
  $('notesTips').replaceChildren(...[room.tip, 'Drag one finger to look around', 'Walk with the joystick, or slide two fingers',
    'Tap + on the player to play your own MP3', 'Switch views top right'].filter(Boolean).map(text => Object.assign(document.createElement('li'), { textContent: text })));
  $('enter').hidden = !!room.soon;
  $('soonCta').hidden = !room.soon;
  $('ownPage').hidden = !!room.soon;
  $('ownPage').href = roomUrl(room.path) || '#';
  $('exit').hidden = true;
  history.replaceState(null, '', '#room=' + room.id);
  if (enterNow && !room.soon) enter();
}

function enter() {
  if (current.soon) return;
  unload();
  live = true;
  loading.hidden = false;
  frame = document.createElement('iframe');
  frame.title = current.name + ' (3D room)';
  frame.allow = 'fullscreen; autoplay';
  frame.src = roomUrl(current.path);
  frame.addEventListener('load', () => {
    if (!live) return;
    setTimeout(() => { loading.hidden = true; poster.hidden = true; }, 400);
    try { frame.contentWindow.focus(); } catch {}
  }, { once: true });
  viewer.append(frame);
  $('exit').hidden = false;
}

$('enter').addEventListener('click', enter);
$('exit').addEventListener('click', () => select(current.id));
$('full').addEventListener('click', () => {
  if (document.fullscreenElement || document.webkitFullscreenElement) return (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  // iPhones can't make a page element fullscreen: open the room on its own page instead, which fills the screen
  if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) { if (!current.soon) window.open(roomUrl(current.path), '_blank'); return; }
  (viewer.requestFullscreen || viewer.webkitRequestFullscreen)?.call(viewer);
  if (!live && !current.soon) enter();
});

// ---- room cards ----------------------------------------------------------------------------------------
const cards = $('cards');
for (const room of ROOMS) {
  const card = document.createElement('article');
  card.className = 'card' + (room.soon ? ' soon' : '');
  card.innerHTML = `
    <div class="card-img">${room.soon ? '<span>IN THE WORKS</span>' : `<img src="${room.preview}" alt="${room.name}" loading="lazy">`}</div>
    <div class="card-body">
      <p class="for"></p><h3></h3><p class="line"></p><ul></ul>
      <div class="card-actions"></div>
    </div>`;
  card.querySelector('.for').textContent = room.kicker;
  card.querySelector('h3').textContent = room.name;
  card.querySelector('.line').textContent = room.line;
  for (const f of room.features) { const li = document.createElement('li'); li.textContent = f; card.querySelector('ul').append(li); }
  const actions = card.querySelector('.card-actions');
  if (room.soon) {
    actions.innerHTML = '<a class="chip" href="#contact">Ask about it</a>';
  } else {
    const walk = document.createElement('button');
    walk.className = 'chip'; walk.type = 'button'; walk.textContent = 'Walk in';
    walk.addEventListener('click', () => { select(room.id, true); $('viewer-top').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    const own = document.createElement('a');
    own.className = 'chip'; own.href = roomUrl(room.path); own.target = '_blank'; own.rel = 'noopener'; own.textContent = 'Own page ↗';
    actions.append(walk, own);
  }
  cards.append(card);
}

// ---- built by Shaden ------------------------------------------------------------------------------------
if (BUILDS.length || NEXUS_URL) {
  $('builds').hidden = false;
  for (const a of document.querySelectorAll('[data-builds-link]')) a.hidden = false;
  for (const b of BUILDS) {
    const card = document.createElement('a');
    card.className = 'build'; card.href = b.url; card.target = '_blank'; card.rel = 'noopener';
    card.innerHTML = `<img alt="" loading="lazy"><div class="build-body"><p class="kind"></p><h3></h3><p class="line"></p></div>`;
    card.querySelector('img').src = b.preview; card.querySelector('img').alt = b.name;
    card.querySelector('.kind').textContent = b.kind || '';
    card.querySelector('h3').textContent = b.name;
    card.querySelector('.line').textContent = b.line || '';
    $('buildCards').append(card);
  }
  if (NEXUS_URL) { $('nexus').href = NEXUS_URL; $('nexus').hidden = false; }
}

// the announcement line picks its room in the viewer
for (const a of document.querySelectorAll('[data-room]')) a.addEventListener('click', () => select(a.dataset.room));

// pricing buttons pick the matching budget in the form
for (const a of document.querySelectorAll('[data-budget]')) {
  a.addEventListener('click', () => { const sel = document.querySelector('select[name="budget"]'); if (sel) sel.value = a.dataset.budget; });
}

// ---- contact form ---------------------------------------------------------------------------------------
const form = $('form'), note = $('formNote');
$('contactDirect').innerHTML = `Or email us directly: <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a>`;
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  note.className = 'form-note'; note.textContent = 'Sending…';
  if (SITE.formEndpoint) {
    try {
      const res = await fetch(SITE.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      form.reset(); note.className = 'form-note ok'; note.textContent = 'Thanks! We\'ll be in touch soon.';
    } catch {
      note.className = 'form-note err'; note.textContent = `That didn't send. Email us at ${SITE.contactEmail} instead.`;
    }
    return;
  }
  const body = `Name: ${data.name}\nEmail: ${data.email}\nBand / brand / artist: ${data.project || '-'}\nStarting point: ${data.room}\nBudget: ${data.budget}\nRelease date: ${data.release || '-'}\nMusic: ${data.music || '-'}\n\n${data.message}`;
  location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent('Room request: ' + (data.project || data.name))}&body=${encodeURIComponent(body)}`;
  note.className = 'form-note ok'; note.textContent = 'Your email app should open with the request ready to send.';
});

$('year').textContent = new Date().getFullYear();

// ---- start: the room in the address (#room=live-concert), or the concert ----
const fromHash = (location.hash.match(/room=([\w-]+)/) || [])[1];
select(ROOMS.some(r => r.id === fromHash) ? fromHash : 'lofi-bedroom');
