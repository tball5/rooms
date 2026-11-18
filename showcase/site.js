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


const ROOMS = [
  {
    id: 'lofi-bedroom', name: 'Lofi Bedroom', path: 'rooms/lofi-bedroom/', preview: 'showcase/previews/lofi-bedroom.jpg', card: 'showcase/previews/lofi-bedroom-card.webp',
    kicker: 'For lofi artists, producers and streamers',
    line: 'A rainy-night bedroom with a real 3D city outside the window. Her computer plays your tracks.',
    features: ['Your songs on her computer', 'Posters, neon sign and colours', 'Her and the cat, restyled'],
    tip: 'Tap the computer, the cat and the window',
    views: ['Lofi', 'Mix', 'Code'], keys: 'click the computer, the cat and the window',
  },
  {
    id: 'the-basement', name: 'The Basement', path: 'rooms/the-basement/', preview: 'showcase/previews/the-basement.webp', card: 'showcase/previews/the-basement-card.webp',
    kicker: 'For bands and garage projects',
    line: 'The band\'s concrete jam space. Visitors play the drums, the guitar and the loop pedal themselves.',
    features: ['Playable drums, guitar and loop pedal', 'Your band members, as characters', 'Flyers and posters on the walls'],
    tip: 'Tap the drums, the guitar and the amp to play them',
    views: ['Basement', 'Mix', 'Code'], keys: 'click the drums, guitar and amp to play',
  },
  {
    id: 'dj-set', name: 'DJ Set', path: 'rooms/dj-set/', preview: 'showcase/previews/dj-set.webp', card: 'showcase/previews/dj-set-card.webp',
    kicker: 'For DJs, clubs and labels',
    line: 'A small house club at night: a DJ on the decks, lasers, a mirror ball, and a drop the whole room feels.',
    features: ['Your DJ in the booth', 'Your venue name in neon', 'Your mixes on the decks'],
    tip: 'Tap ▶ on the player to start the set',
    views: ['Venue', 'Mix', 'Code'], keys: 'Space starts the set',
  },
  {
    id: 'live-concert', name: 'Live Concert', path: 'rooms/live-concert/', preview: 'showcase/previews/live-concert.webp', card: 'showcase/previews/live-concert-card.webp',
    kicker: 'For bands, festivals and release nights',
    line: 'Headline a festival main stage at night. A packed field, lights that hit with the music, and a stage dive.',
    features: ['Your band on the main stage', 'Screens, merch tent and lineup', 'A crowd that reacts to the show'],
    tip: 'Tap ▶ on the player to start the show',
    views: ['Concert', 'Mix', 'Code'], keys: 'Space starts the show',
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
  viewer.classList.toggle('first-tab', tabs.firstElementChild?.dataset.id === room.id);   // square corner under the first tab
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
  $('notesTips').replaceChildren(...[room.tip, 'Drag one finger to look around', 'Walk with the joystick, or spread two fingers apart (pinch them to back up)',
    'Tap + under the window to add your own songs', 'Switch views above the window'].filter(Boolean).map(text => Object.assign(document.createElement('li'), { textContent: text })));
  $('hint').textContent = `WASD to walk · drag to look · ${room.keys} · H to switch views · drop in MP3s`;
  deckIdle(room);
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
  frame.src = roomUrl(current.path) + '?embed';
  frame.addEventListener('load', () => {
    if (!live) return;
    setTimeout(() => { loading.hidden = true; poster.hidden = true; }, 400);
    try { frame.contentWindow.focus(); } catch {}
  }, { once: true });
  viewer.append(frame);
  $('exit').hidden = false;
}

$('enter').addEventListener('click', enter);

// ---- the deck under the window: the room's player, view switch and buttons, mirrored from the room ----------------
// (the room hides its own while it's in this page; it sends what they show, and taps here are passed back to it)
const viewSwitch = $('viewSwitch'), extras = $('dExtras');
function tell(message) {
  if (!frame || !live) return;
  try { if (frame.contentWindow.shadenRoom) return frame.contentWindow.shadenRoom.command(message); } catch { /* another site */ }
  frame.contentWindow.postMessage({ type: 'shaden-cmd', ...message }, '*');
}
// desktop: the view switch stays inside the window, top right, as the room draws it; phones and tablets get it above
const DESK = matchMedia('(min-width: 721px) and (hover: hover) and (pointer: fine)');
const placeSwitch = () => { document.body.classList.toggle('switch-inside', DESK.matches); tell({ modesInside: DESK.matches }); };
DESK.addEventListener?.('change', placeSwitch);
const backToRoom = () => { try { frame?.contentWindow.focus(); } catch {} };       // so WASD keeps walking
function renderSwitch(modes, enabled) {
  const key = JSON.stringify(modes) + enabled;
  if (viewSwitch.dataset.key === key) return;
  viewSwitch.dataset.key = key;
  viewSwitch.replaceChildren(...modes.map(m => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(!!m.on)); b.textContent = m.label;
    b.disabled = !enabled;
    b.addEventListener('click', () => { tell({ mode: m.mode }); backToRoom(); });
    return b;
  }));
}
function deckIdle(room) {
  renderSwitch((room.views || []).map((label, i) => ({ mode: ['lofi', 'mix', 'code'][i], label, on: i === 0 })), false);
  $('dSong').textContent = room.soon ? 'Coming soon' : 'Enter the room to play music';
  $('dPlay').setAttribute('aria-pressed', 'false');
  for (const id of ['dPrev', 'dNext']) $(id).disabled = true;
  $('dVolume').disabled = true; $('dRemove').hidden = true;
  extras.replaceChildren(); extras.dataset.key = '';
  $('deck').classList.toggle('idle', true);
}
window.addEventListener('message', e => {
  const s = e.data;
  if (!frame || e.source !== frame.contentWindow || s?.type !== 'shaden-room') return;
  if ($('deck').classList.contains('idle')) placeSwitch();     // first word from a newly loaded room
  $('deck').classList.remove('idle');
  renderSwitch(s.modes, true);
  $('dSong').textContent = s.song;
  $('dPlay').setAttribute('aria-pressed', String(s.playing));
  $('dPlay').setAttribute('aria-label', s.playing ? 'Pause music' : 'Play music');
  for (const id of ['dPrev', 'dNext']) $(id).disabled = false;
  $('dRemove').hidden = !s.canRemove;
  $('dVolume').disabled = false; $('dVolume').value = s.volume;
  const key = JSON.stringify(s.extras);
  if (extras.dataset.key !== key) {
    extras.dataset.key = key;
    extras.replaceChildren(...s.extras.map(x => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ctl ' + x.cls; b.title = b.ariaLabel = x.label;
      if (x.pressed != null) b.setAttribute('aria-pressed', x.pressed);
      b.innerHTML = x.icon;                                       // the room's own icon (our own rooms only)
      b.addEventListener('click', () => { tell({ click: x.id }); backToRoom(); });
      return b;
    }));
  }
});
$('dPlay').addEventListener('click', () => { if (!live) return enter(); tell({ click: 'playSong' }); backToRoom(); });
$('dPrev').addEventListener('click', () => { tell({ click: 'prevSong' }); backToRoom(); });
$('dNext').addEventListener('click', () => { tell({ click: 'nextSong' }); backToRoom(); });
$('dRemove').addEventListener('click', () => { tell({ click: 'removeSong' }); backToRoom(); });
$('dVolume').addEventListener('input', () => tell({ volume: +$('dVolume').value }));
$('dAddLabel').addEventListener('click', e => { if (!live && !current.soon) { e.preventDefault(); enter(); } });
$('dAdd').addEventListener('change', () => { const files = [...$('dAdd').files]; $('dAdd').value = ''; if (files.length) tell({ files }); backToRoom(); });
// fullscreen shows the room's own controls (the deck isn't on screen then)
const onFull = () => tell({ fullscreen: !!(document.fullscreenElement || document.webkitFullscreenElement) });
document.addEventListener('fullscreenchange', onFull);
document.addEventListener('webkitfullscreenchange', onFull);
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
    <div class="card-img">${room.soon ? '<span>IN THE WORKS</span>' : `<img src="${room.card || room.preview}" alt="${room.name}" loading="lazy" width="800" height="450">`}</div>
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

// the announcement line picks its room in the viewer
for (const a of document.querySelectorAll('[data-room]')) a.addEventListener('click', () => select(a.dataset.room));

// pricing buttons pick the matching starting point in the form (pricing is hidden for now)
for (const a of document.querySelectorAll('[data-budget]')) {
  a.addEventListener('click', () => { const sel = document.querySelector('select[name="budget"]'); if (sel) sel.value = a.dataset.budget; });
}

// the one-line embed: copy it
$('embedCopy')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('embedLine').textContent); $('embedCopy').textContent = 'Copied'; }
  catch { getSelection().selectAllChildren($('embedLine')); $('embedCopy').textContent = 'Press ⌘C / Ctrl+C'; }
  setTimeout(() => { $('embedCopy').textContent = 'Copy'; }, 2000);
});

// speed: once the viewer is close to the screen, fetch the 3D engine and the room ahead of time,
// so "Enter the room" starts sooner (it comes from the browser's cache then)
const ENGINE = ['build/three.module.js', 'build/three.core.js'].map(f => 'https://cdn.jsdelivr.net/npm/three@0.186.0/' + f);
const fetched = new Set();
function fetchAhead(url) {
  if (!url || fetched.has(url) || location.protocol === 'file:') return;
  fetched.add(url);
  const link = Object.assign(document.createElement('link'), { rel: 'prefetch', href: url });
  if (url.startsWith('https://cdn')) link.crossOrigin = 'anonymous';
  document.head.append(link);
}
const warmUp = () => { ENGINE.forEach(fetchAhead); fetchAhead(roomUrl(current.path) + '?embed'); };
if ('IntersectionObserver' in window) {
  new IntersectionObserver((entries, io) => { if (entries.some(e => e.isIntersecting)) { warmUp(); io.disconnect(); } }, { rootMargin: '400px' }).observe(viewer);
}
$('enter').addEventListener('pointerenter', warmUp);

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
  const body = `Name: ${data.name}\nEmail: ${data.email}\nBand / brand / artist: ${data.project || '-'}\nStarting point: ${data.room}\nRelease date: ${data.release || '-'}\nMusic: ${data.music || '-'}\n\n${data.message}`;
  location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent('Room request: ' + (data.project || data.name))}&body=${encodeURIComponent(body)}`;
  note.className = 'form-note ok'; note.textContent = 'Your email app should open with the request ready to send.';
});

$('year').textContent = new Date().getFullYear();

// ---- start: the room in the address (#room=live-concert), or the concert ----
const fromHash = (location.hash.match(/room=([\w-]+)/) || [])[1];
select(ROOMS.some(r => r.id === fromHash) ? fromHash : 'lofi-bedroom');
placeSwitch();

// ---- phones: the three-dot button opens the section links
{
  const top = document.querySelector('.top'), btn = $('menuBtn');
  const setOpen = open => { top.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', e => { e.stopPropagation(); setOpen(!top.classList.contains('open')); });
  $('nav').addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => { if (!top.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}
