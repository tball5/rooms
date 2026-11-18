# Live Concert

A band headlining a festival main stage at night: a packed field, a truss stage with lights, screens,
food truck, merch tent, bar and sound booth. Press play (or Space) to start the show; walk up the
steps at stage right to get on stage, and stage-dive from the front.

```
live-concert/
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
| `playlist` | MP3s in this folder (e.g. a `music/` folder). They play first, before the built-in track. Add `"builtinSong": false` to leave the built-in track out | `["music/song1.mp3"]` |
| `posters` | Swap a poster for your own picture (names below) | `{ "posterBand": "posters/flyer.jpg" }` |
| `band` | The band's name: kick drum, flyers, screens | `"NIGHT SIGNAL"` |
| `guitarist.show` / `hair` / `skin` / `eyes` / `flannel` / `beanie` / `jeans` / `guitar` | The guitarist. `show: false` takes him out | `"#ff5fa8"` |
| `bassist.show` / `skin` / `hair` / `beard` / `shirt` / `pants` / `cap` / `bass` | The bassist | `"#3a5fd8"` |
| `drummer.show` / `skin` / `hair` / `shirt` / `pants` / `gauges` | The drummer | `"#f1d35a"` |

The band's name also goes on the big screens and the lineup poster.

## Poster names

| Name | Where it is | Shape (w × h) |
|---|---|---|
| `posterLineup` | The lineup board by the entrance | 26 × 37 |
| `posterMerch1` | Merch tent, left | 18 × 25 |
| `posterMerch2` | Merch tent, right | 18 × 25 |

## Seeing your changes

Browsers won't let a page read files next to it when you double-click `index.html`, so room.json,
posters and songs only show up when the folder is **hosted**: on the site (GitHub Pages), or on your
computer with `python3 -m http.server` in this folder, then http://localhost:8000.

A song's title, artist and cover come from the file's own tags, or write
`{ "src": "music/song.mp3", "title": "Song name", "artist": "Who" }` instead of just the path.
Only use songs and pictures you made or have the rights to share.

Anything you leave out of room.json stays the way the showcase has it. Delete room.json to get the showcase exactly.
