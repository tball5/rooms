# DJ Set

A two-storey house club at night. The DJ is on the decks in her hoodie, the bouncer is at the door,
there's a bar and a lounge under the balconies, a mirror ball, moving lights and lasers. Stairs at the
front of the room (the right-hand ones are right by the entrance) take you up to a balcony on each side.
Galleries beside the stairs join the balconies to a deeper floor along the back wall, above the
entrance, with a straight-on view of the DJ. You can step down off the front of the stage. Press play (or Space) to start
the set: a deep house track with a breakdown, a build-up and a drop that the lights, the LED wall,
the crowd and the DJ all follow. Walk up the steps on the right of the stage to stand behind her.
Pause (P) freezes the music and the whole room. Views: Venue · Mix · Code (H). In Mix the dancers
turn into skeletons and the walls into falling code.

```
dj-set/
  index.html    the room (leave as is)
  room.json     your settings
  posters/      your poster images (.jpg / .png / .webp)
  music/        your songs or mixes (.mp3 / .m4a / .ogg / .wav)
```

## Settings (room.json)

| Setting | What it does | Example |
|---|---|---|
| `title` | The name in the corner and the browser tab | `"Saturday Session"` |
| `venue` | The club's name: neon sign, booth front, LED wall, flyers | `"LOW HOUSE"` |
| `djName` | The DJ's name on the LED wall and flyers | `"DJ NOVA"` |
| `doors` | Where the way out goes. An outside link shows a card with a Go button; another room on the same site walks you straight through. `""` = not connected yet | `{ "door": { "href": "https://example.com/tickets", "label": "Get tickets" } }` |
| `playlist` | Songs or mixes on the player. The built-in track is always first, then these | `["music/mix1.mp3"]` |
| `posters` | Swap a flyer for your own picture (names below) | `{ "posterFlyer1": "posters/flyer.jpg" }` |
| `dj.show` / `hair` / `eyes` / `skin` / `hoodie` / `pants` / `shoes` | The DJ. `show: false` takes her out | `"#ff5fa8"` |
| `bartender.show` / `shirt` / `skin` / `hair` | The bartender | `"#2a6a8a"` |
| `bouncer.show` / `shirt` / `skin` | The bouncer | `"#0e0e10"` |
| `talk` | What the DJ says when you say hi | `["hey!", "wait for the drop"]` |

## Poster names

| Name | Where it is | Shape (w × h) |
|---|---|---|
| `posterFlyer1` | Entry hall, right wall, nearest the door | 12 × 17 |
| `posterFlyer2` | Entry hall, right wall, nearer the club | 12 × 17 |
| `posterFlyer3` | Club, left wall past the bar | 7 × 10 |

## Seeing your changes

Browsers won't let a page read files next to it when you double-click `index.html`, so room.json,
posters and songs only show up when the folder is **hosted**: on the site (GitHub Pages), or on your
computer with `python3 -m http.server` in this folder, then http://localhost:8000.

Songs you add are read for their title, artist and cover from the file's tags; the lights follow any
song (they guess the drops from how loud it gets). Only use music and pictures you made or have the
rights to share.

Anything you leave out of room.json stays the way the showcase has it. Delete room.json to get the showcase exactly.
