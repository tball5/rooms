# Shaden Tech · 3D Rooms

Walk-around 3D rooms for bands, brands and artists, and the showcase page that sells them.
Everything runs in the browser with three.js. There's no build step and no app.

```
index.html                ← the showcase page (Shaden Tech)
showcase/
  style.css               ← the showcase's look
  site.js                 ← the showcase's rooms list and contact settings
  previews/               ← still images of each room
rooms/
  lofi-bedroom/           ← each room is a folder: index.html + room.json + posters/ + music/ + README
  the-basement/
  live-concert/
  dj-set/
```

## Put it online (GitHub Pages)

1. Upload everything in this folder to the root of your repo.
2. In the repo, go to **Settings → Pages**, then **Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.
   Each room also has its own page, e.g. `…/rooms/live-concert/`.

To use your own domain later, add it under **Settings → Pages → Custom domain**.

## Try it on your computer

Rooms read `room.json`, posters and songs from their folder, and browsers block that when you
double-click a file. So run a tiny local server in this folder:

```
python3 -m http.server
```

Then open http://localhost:8000.

## The showcase page

Open `showcase/site.js`. At the top:

- **`SITE.contactEmail`**: where room requests go. Change `hello@example.com` to your real address.
- **`SITE.formEndpoint`**: optional. GitHub Pages can't receive forms by itself. If you make a free
  form at a service like Formspree and paste its address here, requests arrive in your inbox
  without opening the visitor's email app.
- **`ROOMS`**: the rooms in the viewer and the cards: name, folder, preview image, one-liner and
  three highlights. To add a room, copy an entry. `soon: true` shows it as "coming soon".

The viewer only ever runs one room. Switching rooms shuts the old one down completely, freeing
its graphics memory, before the next one loads. Link straight to a room with
`…/#room=the-basement`.

## Making a client's room

1. Copy a room's folder, e.g. `rooms/live-concert` → `rooms/night-signal-live`.
2. Edit its **room.json**: name, band, colours, door links, songs, posters. Each room's README
   lists every setting and poster name.
3. Put their songs in `music/` and their art in `posters/`.
4. Their room is live at `…/rooms/night-signal-live/`. Add it to `ROOMS` in `showcase/site.js` if
   it should appear on the showcase.

Anything left out of room.json stays the way the showcase room has it.

## Music and pictures

Only put songs and art in the repo that you or your client made, or have the rights to share. A
public repo means anyone can download them.
