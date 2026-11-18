# Yalieon 🐶

<img width="1105" height="533" alt="Screenshot 2026-11-17 at 8 03 20 PM" src="https://github.com/user-attachments/assets/3995e1e8-4a77-4473-ae16-5f967f69f4d3" />


**A daily Yale game where basic answers get you nowhere.**

[![Watch Yalieon in action](https://img.youtube.com/vi/PnOtj-ZO2Ds/maxresdefault.jpg)](https://youtu.be/PnOtj-ZO2Ds)

Seven prompts. Twenty-five seconds each. One pixel bulldog stuck on top of Harkness Tower.

Rare answers drop him down the tower. 

## How we built it

![Me, using Grok, thriving](grok.png)

We built this with Grok in Cursor. Then we hooked Cursor up to our Grok API so the questions come straight from Twitter, which is exactly as unhinged as it sounds.

It also reads The Rumpus, the Yale Daily News, The Politic, and whatever else the web is saying about Yale today. So the game knows the campus gossip before you do.

Want live questions? Put a key in `.env`:

```
XAI_API_KEY=your-key
```

No key? It plays from the built-in question bank and judges you just the same.

SS of us using Grok:
<img width="1164" height="928" alt="Screenshot 2026-11-17 at 7 41 07 PM" src="https://github.com/user-attachments/assets/ecfea8d0-de12-4ec9-9943-488b7c8140cf" />


