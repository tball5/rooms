# Lofi Bedroom

The Lofi Bedroom showcase, ready to make your own. You don't need to touch
the code. Everything you can change is in **room.json**, and your pictures and songs go in the
`posters` and `music` folders.

```
lofi-bedroom/
  index.html    the room (leave as is)
  room.json     your settings
  posters/      your poster images (.jpg / .png / .webp)
  music/        your songs (.mp3 / .m4a / .ogg / .wav)
```

Anything you leave out of room.json stays the way the showcase has it, so you can delete the
lines you don't need. If you delete room.json completely, you get the showcase exactly.

## Settings

| Setting | What it does | Example |
|---|---|---|
| `title` | The name shown in the corner and the browser tab | `"Mika's Room"` |
| `doors` | Where the door goes when you click it. Another room on the same site (`"../my-other-room/"`) walks you straight through; an outside link (`"https://…"`) shows a card with a Go button. Leave it `""` for a door that isn't connected yet | `{ "door": { "href": "https://example.com/store", "label": "Visit the store" } }` |
| `playlist` | MP3s in this folder (e.g. a `music/` folder). They play first, before the built-in track. Add `"builtinSong": false` to leave the built-in track out | `["music/song1.mp3", "music/song2.mp3"]` |
| `posters` | Swap any poster for your own picture (names below) | `{ "posterTide": "posters/my-art.jpg" }` |
| `girl.show` | `false` takes her out (the chair stays) | `false` |
| `girl.smoking` | `false`: no cigarette, smoke or ashtray | `false` |
| `girl.hair` / `eyes` / `skin` / `sweater` / `lips` | Her colours | `"#ff5fa8"` |
| `cat.show` / `color` / `eyes` | The cat | `"#d9893a"` |
| `neon.show` / `text` / `color` / `moon` / `moonColor` / `brightness` | The neon sign. Brightness 1 is normal, 0.5 is half | `"chill"` |
| `colors.walls` / `floor` / `ceiling` | Room colours | `"#4a6078"` |
| `talk` | What she says when you click "Say hi" | `["hey!", "nice night"]` |
| `city.seed` | Any number gives a different city skyline | `777` |

A song's title, artist and cover art come from the file's own tags. To set them yourself, use
`{ "src": "music/song.mp3", "title": "Song name", "artist": "Who made it" }` instead of just the
path. Visitors can also add songs with the **+** button, but those stay in their own browser.

## Poster names

Your picture is cropped to fill the poster's shape, so a picture with a similar shape works best.

| Name | Where it is | Shape (w × h) |
|---|---|---|
| `posterTape` | Wall opposite the window, far left ("LOFI TAPES") | 18 × 25 |
| `posterGhost` | Opposite wall, upper ("boo.") | 3 × 4 |
| `posterMush` | Opposite wall, small one under the ghost | 4 × 5 |
| `posterTide` | Opposite wall, right of the corkboard ("NEON TIDE") | 36 × 49 |
| `posterStars` | Opposite wall, far right (constellations) | 3 × 4 |
| `posterMoon` | Above her desk ("LUNA") | 18 × 25 |
| `posterSketch` | Beside the desk, and pinned on the corkboard | 10 × 13 |
| `posterBand` | Above the bed ("NIGHT SIGNAL") | 12 × 17 |
| `posterCat` | Left wall, by the bed ("nine lives") | square |
| `polaroidA`, `polaroidB`, `polaroidC` | Little photos above the desk and on the corkboard | 5 × 6 |
| `noteTodo`, `noteHeart` | Sticky notes on the corkboard | square |

## Seeing it, and giving it to someone

Browsers won't let a page read files next to it if you just double-click `index.html`, so your
room.json, posters and songs only show up when the folder is **hosted**:

- **This repo:** it's already hosted with the rest of the site on GitHub Pages.
- **Any static web host** works too: GitHub Pages, Netlify Drop, Cloudflare Pages, itch.io (as an HTML game).
- **On your own computer:** open a terminal in this folder and run `python3 -m http.server`,
  then go to http://localhost:8000.

To give a copy to someone, zip the folder and send it. They change room.json and add their own
posters and songs, and the showcase stays untouched.

Only use songs and pictures you made or have the rights to share.

## Bigger changes

Moving furniture, adding objects, or changing her pose or face happens in the `ROOM` description
near the top of the script in index.html. It's commented. A room.json that contains `"objects"`
replaces the whole room instead of adjusting the showcase.
