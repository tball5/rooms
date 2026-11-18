# The Basement

A band's concrete jam space at night. Visitors walk around and play the drums (click or keys 1–8),
the guitar (click or G) through the amp, and the loop pedal (click or L, hold to clear).

```
the-basement/
  index.html    the room (leave as is)
  room.json     your settings
  posters/      your poster images (.jpg / .png / .webp)
  music/        your songs (.mp3 / .m4a / .ogg / .wav)
```

## Settings (room.json)

| Setting | What it does | Example |
|---|---|---|
| `title` | The name in the corner and the browser tab | `"Our Room"` |
| `doors` | Where the door goes. An outside link shows a card with a Go button; another room on the same site walks you straight through. `""` = not connected yet | `{ "door": { "href": "https://example.com/tickets", "label": "Get tickets" } }` |
| `playlist` | Songs on the player. The built-in track is always first, then these | `["music/song1.mp3"]` |
| `posters` | Swap a poster for your own picture (names below) | `{ "posterBand": "posters/flyer.jpg" }` |
| `band` | The band's name: kick drum, flyers, screens | `"NIGHT SIGNAL"` |
| `guitarist.show` / `hair` / `skin` / `eyes` / `flannel` / `beanie` / `jeans` / `guitar` | The guitarist. `show: false` takes him out | `"#ff5fa8"` |
| `bassist.show` / `skin` / `hair` / `beard` / `shirt` / `pants` / `cap` / `bass` | The bassist | `"#3a5fd8"` |
| `drummer.show` / `skin` / `hair` / `shirt` / `pants` / `gauges` | The drummer | `"#f1d35a"` |
| `colors.floor` / `walls` / `ceiling` | Room colours | `"#4a4a52"` |
| `talk` | What the guitarist says when you talk to him | `["hey", "wanna jam?"]` |

## Poster names

| Name | Where it is | Shape (w × h) |
|---|---|---|
| `posterBand` | The band flyer on the back wall | 5 × 7 |
| `posterMildew` | Right wall, the bigger of the two | 31 × 43 |
| `posterFurnace` | Right wall, the smaller one beside it | 3 × 4 |
| `posterCardboard` | Left wall, by the stairs | 28 × 39 |

## Seeing your changes

Browsers won't let a page read files next to it when you double-click `index.html`, so room.json,
posters and songs only show up when the folder is **hosted**: on the site (GitHub Pages), or on your
computer with `python3 -m http.server` in this folder, then http://localhost:8000.

A song's title, artist and cover come from the file's own tags, or write
`{ "src": "music/song.mp3", "title": "Song name", "artist": "Who" }` instead of just the path.
Only use songs and pictures you made or have the rights to share.

Anything you leave out of room.json stays the way the showcase has it. Delete room.json to get the showcase exactly.
