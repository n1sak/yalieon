# Yalieon design

A Yale daily in the shape of a Krillion descent. One pixel scene, one typeface, four screens. The bulldog drops down Harkness Tower. A miss is Harvard and does not drop.

Reference: the layout, scanlines, and button chrome of [krillion.io](https://krillion.io/). Do not copy its ocean, boat, or krill.

## Type

One face everywhere: **VT323**, loaded from Google Fonts. Fallback: `ui-monospace, monospace`.

| Use | Size | Tracking | Color |
|---|---|---|---|
| Wordmark | `clamp(68px, 11vw, 124px)` | `0.04em` | `#e8f1ff` |
| Subtitle `THE DAILY DESCENT` | `clamp(18px, 2vw, 26px)` | `0.34em` | `#5eb0ea` |
| Tagline | 18px | `0.08em` | `#7f93ab` |
| Begin button | 28px | `0.14em` | `#e8f1ff` |
| Prompt | `clamp(30px, 4vw, 46px)` | `0.01em` | `#e8f1ff` |
| Tier name | `clamp(40px, 6vw, 64px)` | `0.12em` | tier color |
| Body | 16px | `0.02em` | `#e8f1ff` |

Wordmark shadow, on each letter: crimson `-4px 3px 0 #c42846`, Yale blue `4px -3px 0 rgba(77, 155, 255, 0.9)`, glow `0 0 30px rgba(77, 155, 255, 0.35)`. Letters fade in from 14px above, 0.18s apart.

All UI copy is uppercase except the boot line (`descending…`), flavor lines, and the player's typed answer.

## Color

| Token | Hex | Use |
|---|---|---|
| Ink | `#e8f1ff` | Text |
| Muted | `#93a8c2` | Secondary text |
| Yale cyan | `#4d9bff` | Rings, links, timer, focus |
| Crimson | `#e23b55` | Prompt kicker, low timer |
| Harvard | `#a51c30` | Miss mark and tier |
| Panel | `#10192b` | Cards, party, buttons |
| Night | `#07111f` | Page ground, boot |
| Sky top | `#e7f1f8` | Sky gradient start |
| Sky bottom | `#a9c3d8` | Sky gradient end |
| Shaft | `#10243f` → `#0a1830` | Below the horizon |
| Dive button | `#c45c6e` / border `#e7a0ad` | Submit |
| Sun | `#ffe98a` | Pixel sun |

Corners are square. No border-radius on buttons, cards, or inputs.

## Scene

Full viewport. The world is 2500px tall and the camera follows the bulldog once the descent leaves the crown.

- Sky: vertical gradient, four pixel clouds (`#f7fbff`, 14px blocks), a pixel sun top-right, three pixel birds (`#5c738c`) crossing left to right.
- Horizon: two navy wave shapes at the waterline, then the shaft darkens.
- Harkness Tower: chunky pixel stone, lighter at the crown, Yale navy by the base. Arched windows, a spire. Centered, starting 220px from the top of the world.
- Flavor lines sit on the left and right of the shaft, 18px, `#d6e2f0` at 72% opacity. Zone names (`THE GOTHIC SHAFT`, `BENEATH BRANFORD`) are 20px and brighter.
- Depth ruler on the right edge. The player marker is a crimson triangle labeled `YOU`.
- Scanlines cover everything: 1px of `rgba(6, 12, 24, 0.16)` every 3px, `multiply`, pointer-events none.
- As depth increases, a fixed navy shade rises to 88% opacity.

## Character

Asset: `bulldog.png`. A sitting pixel bulldog in a Yale-blue sweater with a white Y. White fur, gray ears, black outline. Background is transparent.

| Place | Box |
|---|---|
| On the tower | 92 × 112px, image-rendering pixelated, bottom-aligned |
| Result card | 78 × 96px |
| Party row | 40 × 48px |
| Dive log | 26 × 32px |

On the home screen the dog bobs 4px, 1.7s. A miss shakes it sideways and swaps the card mark for the crimson Harvard shield. The dog does not drop on a miss.

## Chrome

- Menu button, top-left, 16px inset. 36 × 34px, fill `#1b2838`, 2px border `#31445e`.
- Sound, settings, wardrobe stacked top-right, 8px apart. Same button. Muted state turns the icon `#ff7a93`.
- Focus ring: 2px `#4d9bff`, 2px offset.

## Screens

### 1. Boot

Full `#07111e`. Centered `descending…`, 18px, tracking `0.42em`. About 0.7s, then home.

### 2. Home

Wordmark, subtitle, tagline centered in the sky. The bulldog sits on the spire.

Bottom stack, max 680px wide, 12px gaps:

1. `▸ HOW TO PLAY` — muted, tracking `0.16em`. Opens a left-aligned list, 17px `#a9bdd2`.
2. `Privacy` text link, `#8ea2b8`.
3. Boola Party card. Fill `#10192b`, 3px `#4d9bff` border, 3px outer night ring, cyan glow. A `#16324f` tab reading `BETA · LIMITED TIME` sits on the top edge. Inside: small bulldog, `BOOLA PARTY` at 28px, a 7px square, and the player count.
4. `▼ BEGIN DESCENT ▼`. Full width, 28px, padding `13px 34px 11px`. Fill `rgb(16, 29, 51)`. Shadow: 3px night ring, 6px cyan ring, 6px drop `#122848`, cyan glow.
5. A row: `DESCENT #125` on the left, `ARCHIVE`, `THEMED PACKS`, `UNLIMITED` as small `#1a2738` buttons.

### 3. Prompt

HUD across the top:

- Left pill: label `DEPTH`, value in `#7ecbff`.
- Center: seven 14 × 10px pips. Current pip is `#ff6d88`. Finished pips take that answer's tier color.
- Right pill: label `SCORE`, value in `#ff8fa3`.

Center card, max 640px, fill `#121a2b`, 3px border `#1c283c`, hard shadow `6px 6px 0 #0a101c`. Kicker `PROMPT N OF 7` in `#ff6d88`, 18px, tracking `0.18em`. Prompt in the large size. Foot: `▼ rarer answers sink deeper ▼` in `#8ea6c0`.

Bottom dock, on a fade to `#050c16`:

- 72px timer. Track `#1c3048`, ring `#4d9bff`, 4px stroke. Under 6 seconds the ring turns `#ff6d88`. Number centered, 28px.
- Input: fill `#101826`, 3px border `#24344a`, 28px type, placeholder `#6aa8c8` reading `type one answer...`. A 4px cyan bar sits under the field. A miss-during-play line, `not on the sheet.`, sits above the field in `#ff6d88`.
- `DIVE` button, fill `#c45c6e`, 3px border `#e7a0ad`, 26px, tracking `0.16em`.

Three seconds of preview (`get ready…`, input disabled), then 25 seconds.

### 4. Result

Same card position. Tier name in the tier color. The answer in quotes, 28px. `+N PTS · drop N ft`, or `+0 PTS · nowhere` for Harvard. One line of flavor under it, 18px `#9aafc4`. Then `DESCEND ▼` (or `THE BEARING ▼` after prompt 7), same double ring as Begin, 22px.

Harvard shows the shield. Every other tier shows the bulldog.

### 5. Bearing

Small chromatic `YALIEON`, then `DESCENT #125 COMPLETE` in `#7ec8ff`. The score is the hero, up to 92px. A curve of the day's scores with a crimson `YOU` marker. `BETTER THAN N% OF TODAY'S PLAYERS` in cyan.

Dive log: seven columns. Each drop is a vertical bar in the tier color. The bulldog or Harvard shield sits at the depth. Numbers 1–7 underneath.

The bearing line names the day:

| Score | Name |
|---|---|
| 0–69 | Harvard |
| 70–150 | Prefrosh |
| 151–250 | College |
| 251–350 | Rare |
| 351–449 | Deep cut |
| 450+ | Yalieon |

## Levels

Same points and order as Krillion. Harvard replaces the miss.

| Level | Points | Color | Line |
|---|---|---|---|
| Harvard | 0 | `#a51c30` | The worst. That's a Cambridge answer. |
| Prefrosh | 10 | `#d5e4f4` | The answer everyone blurts out. |
| Too Clever | 15 | `#ff9f43` | The pick that felt obscure. It wasn't. |
| College | 30 | `#4d9bff` | Swimming with the residential colleges. |
| Rare | 60 | `#ff5252` | Genuinely uncommon. Nice pull. |
| Deep Cut | 85 | `#b794f6` | Properly down the shaft. |
| Yalieon | 100 | `#ffd166` | One in a yalieon. |

One point is one foot. 700 is the crypt. A perfect day is 700.

## Questions

Seven broad prompts, the kind a student would say out loud. Not a question about one post.

1. Name a Yale library
2. Name a New Haven pizza place
3. Name a place to study that isn't a library
4. Name something students complain about with Yale dining
5. Name a recent Yale student achievement people are talking about
6. Name a residential college event or tradition from this week
7. What are Yale students thinking about right now?

Obvious answers stay shallow. The one satisfying rare answer on a prompt is Yalieon.

## Menu and panels

Menu slides over a `rgba(4, 8, 16, 0.45)` veil. Panel is 320px, `#0d1726`, right border `#1e2c40`. Eyebrow `YALIEON` in `#6f8eae`. Title `Menu` at 40px. A rule, then the links: Daily descent, Unlimited, Boola Party, Archive, Themed packs, My Yalieon, Friends, Settings, FAQ.

Settings, wardrobe, and FAQ use a centered panel, max 440px, fill `#10192b`, 3px border `#24344c`.

## Motion

- Letter stagger on the wordmark.
- Idle bob on the bulldog.
- Dog shake, 0.4s, on Harvard.
- Field shake, 0.28s, when an answer is not on the sheet.
- Depth eases with a cubic curve when the bulldog drops. The world translates so the dog stays near 42% of the viewport.
- Reduced motion: skip the drop animation and the idle bob.

## Files

| File | What it is |
|---|---|
| `index.html` | Screen structure |
| `styles.css` | Every measurement above |
| `game.js` | Tiers, questions, motion |
| `bulldog.png` | The character |
