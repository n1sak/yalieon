# Yalieon

A Yale daily in the shape of a descent. Seven prompts, twenty-five seconds each. Rarer answers drop a pixel bulldog farther down Harkness Tower. A miss is a Harvard answer, and it does not drop.

From this folder:

```
node server.js
```

Then visit http://localhost:5173

The bulldog on the tower is `bulldog.png`. It drops farther as answers get rarer.

The questions stay broad, the way students actually talk: a library, a pizza place, a study spot, dining, what people are talking about. A miss is Harvard, the worst. Under that, rarer answers climb through Rare, Deep Cut, and Yalieon.

The live X search is optional. Put a key in `.env` if you want a fresh sheet in that same basic style:

```
XAI_API_KEY=your-key
```

The day's sheet is cached in `data/` so the stream is read once. With no key, or if the stream fails, the game keeps the baked Yale question bank.

Try `Sterling` on the first prompt when the bank is playing. Anything that is not on the sheet can be retried until the clock hits zero.
