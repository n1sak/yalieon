/* Yalieon — a daily descent down Harkness Tower. */
(function () {
  const DESCENT_NO = 125;
  const PREVIEW_MS = 3000;
  const PLAY_MS = 25000;
  const RING = 2 * Math.PI * 30;

  const TIERS = {
    harvard: { name: "HARVARD", points: 0, color: "#A51C30", line: "The worst. That's a Cambridge answer." },
    prefrosh: { name: "COMMON CRIMSON", points: 10, color: "#d5e4f4", line: "Most common answers." },
    tooblue: { name: "TOO CLEVER ELI", points: 15, color: "#ff9f43", line: "The pick that felt obscure. It wasn't." },
    college: { name: "BULLDOG SCHOOLER", points: 30, color: "#4d9bff", line: "Swimming with the residential colleges." },
    oldblue: { name: "RARITAS", points: 60, color: "#ff5252", line: "Genuinely uncommon. Nice pull." },
    deepcut: { name: "DEEP CUT DOG", points: 85, color: "#b794f6", line: "Properly down the shaft." },
    yalieon: { name: "ONE IN A YALION", points: 100, color: "#ffd166", line: "Rarest answers." },
  };

  const PROMPTS = [
    {
      text: "Name a Yale library",
      gem: "It sits in Farmington. Almost nobody counts it as a Yale library.",
      answers: [
        { tier: "prefrosh", aliases: ["sterling", "sml", "sterling library", "sterling memorial library"] },
        { tier: "prefrosh", aliases: ["bass", "bass library"] },
        { tier: "prefrosh", aliases: ["beinecke", "beinecke library", "beinecke rare book and manuscript library", "beinecke rare book library"] },
        { tier: "tooblue", aliases: ["marx", "marx library", "ssl", "marx science and social science library"] },
        { tier: "college", aliases: ["law library", "law", "lillian goldman", "yale law library", "law school library"] },
        { tier: "oldblue", aliases: ["haas", "arts library", "haas family arts library"] },
        { tier: "deepcut", aliases: ["gilmore", "music library", "irving s gilmore music library"] },
        { tier: "deepcut", aliases: ["medical library", "med library", "cushing whitney", "cushingwhitney", "harvey cushing"] },
        { tier: "deepcut", aliases: ["divinity library", "divinity", "yale divinity school library"] },
        { tier: "deepcut", aliases: ["center for british art", "ycba", "british art", "yale center for british art"] },
        { tier: "deepcut", aliases: ["kline", "kline science library"] },
        { tier: "deepcut", aliases: ["sterling stacks", "stacks"] },
        { tier: "deepcut", aliases: ["cross campus library", "ccl", "old ccl"] },
        { tier: "deepcut", aliases: ["sml reading room", "nave", "sterling nave"] },
        { tier: "yalieon", aliases: ["lewis walpole library", "walpole", "lewis walpole"] },
      ],
    },
    {
      text: "Name a New Haven pizza place",
      gem: "The campus pizza counter that isn't on Wooster.",
      answers: [
        { tier: "prefrosh", aliases: ["frank pepe", "pepe", "pepes", "frank pepe pizzeria napoletana", "pepes pizzeria"] },
        { tier: "prefrosh", aliases: ["sallys", "sally", "sallys apizza"] },
        { tier: "prefrosh", aliases: ["modern", "modern apizza"] },
        { tier: "tooblue", aliases: ["bar", "bar pizza", "bar new haven"] },
        { tier: "college", aliases: ["da legna", "da legna al foco"] },
        { tier: "oldblue", aliases: ["zeneli", "zeneli pizzeria"] },
        { tier: "deepcut", aliases: ["new haven style pizza", "new haven style", "apizza"] },
        { tier: "deepcut", aliases: ["pizza on chapel"] },
        { tier: "deepcut", aliases: ["est est est"] },
        { tier: "deepcut", aliases: ["nolo"] },
        { tier: "deepcut", aliases: ["ippolita"] },
        { tier: "deepcut", aliases: ["ernies", "ernie"] },
        { tier: "deepcut", aliases: ["tony and lucilles", "tony lucilles", "tony and lucille"] },
        { tier: "deepcut", aliases: ["brick oven"] },
        { tier: "deepcut", aliases: ["bobbis", "bobbi", "bobbis pizza", "bobbys", "bobby"] },
        { tier: "yalieon", aliases: ["yorkside", "yorkside pizza"] },
      ],
    },
    {
      text: "Name a place to study that isn't a library",
      gem: "The college snack bar. Not a library, still a study spot.",
      answers: [
        { tier: "prefrosh", aliases: ["common room", "college common room", "my common room"] },
        { tier: "prefrosh", aliases: ["coffee shop", "cafe", "blue state", "koffee", "willoughbys", "willoughby"] },
        { tier: "tooblue", aliases: ["dining hall", "my dining hall", "residential college dining hall"] },
        { tier: "tooblue", aliases: ["my room", "dorm", "suite", "my suite"] },
        { tier: "tooblue", aliases: ["cross campus", "cross campus lawn", "on cross campus"] },
        { tier: "college", aliases: ["sterling nave", "nave", "sterling memorial library nave"] },
        { tier: "college", aliases: ["bass underground", "bass basement"] },
        { tier: "oldblue", aliases: ["ts", "toads", "toads place"] },
        { tier: "oldblue", aliases: ["lc", "linsly chittenden", "linslychittenden", "linsly"] },
        { tier: "oldblue", aliases: ["wlh", "william l harkness hall", "harkness hall"] },
        { tier: "oldblue", aliases: ["hgs", "hall of graduate studies"] },
        { tier: "oldblue", aliases: ["kline tower", "kline", "kline biology tower"] },
        { tier: "deepcut", aliases: ["rosenfeld hall", "rosenfeld"] },
        { tier: "deepcut", aliases: ["hive", "yale hive"] },
        { tier: "deepcut", aliases: ["schwarzman", "schwarzman center"] },
        { tier: "deepcut", aliases: ["old campus", "old campus lawn", "outside on old campus"] },
        { tier: "deepcut", aliases: ["friends suite", "friends room", "a friends suite"] },
        { tier: "deepcut", aliases: ["empty classroom", "classroom"] },
        { tier: "yalieon", aliases: ["buttery"] },
      ],
    },
    {
      text: "Name something students complain about with Yale dining",
      gem: "The dining-hall pie. A complaint with its own slice.",
      answers: [
        { tier: "prefrosh", aliases: ["meal swipes expire", "points expire", "dining points expire", "swipes disappearing", "swipes expire", "meal swipes"] },
        { tier: "prefrosh", aliases: ["forced meal plan", "required meal plan", "have to buy meal plan", "meal plan"] },
        { tier: "tooblue", aliases: ["quality of food", "the food", "bad food", "food quality", "food"] },
        { tier: "tooblue", aliases: ["limited late night options", "late night", "no late food", "late night options"] },
        { tier: "tooblue", aliases: ["crowded dining halls", "lines", "too crowded", "crowded"] },
        { tier: "tooblue", aliases: ["soft serve", "softserve", "soft serve ice cream"] },
        { tier: "college", aliases: ["repetitive menus", "same food every week", "menu rotation", "repetitive"] },
        { tier: "college", aliases: ["price", "too expensive", "cost of meal plan"] },
        { tier: "college", aliases: ["vegetarian options", "vegan options", "not enough vegan", "veggie options", "vegetarian", "vegan"] },
        { tier: "oldblue", aliases: ["halal", "kosher", "halal kosher", "halal kosher availability"] },
        { tier: "oldblue", aliases: ["dining hall hours", "closes too early", "hours"] },
        { tier: "deepcut", aliases: ["allergy accommodations", "allergies", "allergy"] },
        { tier: "deepcut", aliases: ["lawsuit", "meal plan lawsuit", "alum lawsuit"] },
        { tier: "deepcut", aliases: ["transferability of points", "cant transfer points", "transfer points"] },
        { tier: "deepcut", aliases: ["south campus vs old campus", "dining inequality", "south campus"] },
        { tier: "deepcut", aliases: ["no real dinner on weekends", "weekend dining", "weekend dinner"] },
        { tier: "yalieon", aliases: ["the pizza", "dining hall pizza", "pizza"] },
      ],
    },
    {
      text: "Name a recent Yale student achievement people are talking about",
      gem: "The award that never makes the group chat.",
      answers: [
        { tier: "prefrosh", aliases: ["rhodes scholarship", "rhodes", "rhodes scholars", "rhodes scholar", "three rhodes"] },
        { tier: "tooblue", aliases: ["yaledancers", "yale dancers", "yaledancers beat harvard", "dance competition"] },
        { tier: "tooblue", aliases: ["basketball win", "mens basketball", "basketball", "beat emmanuel"] },
        { tier: "college", aliases: ["swim and dive", "swimming", "swim", "beat dartmouth"] },
        { tier: "college", aliases: ["senior award", "a specific seniors award"] },
        { tier: "college", aliases: ["research publication", "published paper", "publication", "research"] },
        { tier: "college", aliases: ["fellowship", "truman", "marshall", "fulbright"] },
        { tier: "college", aliases: ["world of dance", "worldofdance"] },
        { tier: "oldblue", aliases: ["hackathon win", "hackathon"] },
        { tier: "oldblue", aliases: ["startup funding", "raised money", "startup", "yc", "y combinator"] },
        { tier: "oldblue", aliases: ["athletic championship", "ivy title", "championship"] },
        { tier: "oldblue", aliases: ["nothing", "too many to name", "everyone is achieving", "too many"] },
        { tier: "deepcut", aliases: ["debate tournament", "debate win", "debate"] },
        { tier: "deepcut", aliases: ["art exhibition", "gallery show", "art show"] },
        { tier: "deepcut", aliases: ["music performance", "concert", "recital"] },
        { tier: "yalieon", aliases: ["community service award", "community service"] },
      ],
    },
    {
      text: "Name a residential college event or tradition from this week",
      gem: "Sophomore sushi night. Almost nobody types the whole thing.",
      answers: [
        { tier: "prefrosh", aliases: ["themed dinner", "south asian dinner", "cultural dinner", "morse stiles dinner"] },
        { tier: "tooblue", aliases: ["college tea", "masters tea", "head of college tea", "tea"] },
        { tier: "tooblue", aliases: ["study break", "college study break"] },
        { tier: "tooblue", aliases: ["intramural game", "im sports", "intramurals", "intramural", "ims", "im"] },
        { tier: "tooblue", aliases: ["movie night", "college movie", "movie"] },
        { tier: "college", aliases: ["game night", "board games"] },
        { tier: "college", aliases: ["buttery event", "buttery special", "buttery"] },
        { tier: "college", aliases: ["suite party", "suite", "party in suite"] },
        { tier: "oldblue", aliases: ["college council meeting", "college council", "ycc"] },
        { tier: "oldblue", aliases: ["diwali", "diwali celebration"] },
        { tier: "oldblue", aliases: ["africa week", "africa week event", "sankofa"] },
        { tier: "oldblue", aliases: ["nothing special", "quiet week", "nothing"] },
        { tier: "deepcut", aliases: ["open mic", "open mic night"] },
        { tier: "deepcut", aliases: ["library study party", "study party"] },
        { tier: "deepcut", aliases: ["fitness class", "yoga", "yoga in college", "fitness"] },
        { tier: "yalieon", aliases: ["sophomore sushi night", "sushi night", "sophomore sushi"] },
      ],
    },
    {
      text: "What are Yale students thinking about right now?",
      gem: "The hackathon on campus while everyone else says finals.",
      answers: [
        { tier: "prefrosh", aliases: ["finals", "exams", "studying for finals"] },
        { tier: "tooblue", aliases: ["thanksgiving break", "thanksgiving", "break", "going home"] },
        { tier: "tooblue", aliases: ["grade inflation", "grades", "grading policy", "pass fail", "passfail"] },
        { tier: "tooblue", aliases: ["internships", "internship", "summer internships", "recruiting"] },
        { tier: "college", aliases: ["applications", "grad school", "job applications", "fellowships", "apps"] },
        { tier: "college", aliases: ["sleep", "being tired", "napping", "tired"] },
        { tier: "college", aliases: ["meal plan", "dining", "food"] },
        { tier: "college", aliases: ["campus politics", "mcinnis", "administration", "protests"] },
        { tier: "college", aliases: ["nothing", "existential dread", "vibes", "void"] },
        { tier: "oldblue", aliases: ["relationships", "dating", "situationship"] },
        { tier: "oldblue", aliases: ["clubs", "extracurriculars", "a cappella", "acappella"] },
        { tier: "deepcut", aliases: ["money", "financial aid", "budget"] },
        { tier: "deepcut", aliases: ["weather", "cold", "new haven weather"] },
        { tier: "deepcut", aliases: ["digital ids", "digital id", "ycc proposals"] },
        { tier: "deepcut", aliases: ["rhodes scholars", "rhodes"] },
        { tier: "deepcut", aliases: ["pizzas", "pizza", "pepes", "getting food"] },
        { tier: "deepcut", aliases: ["residential college", "college pride", "my college", "college"] },
        { tier: "yalieon", aliases: ["grokathon", "hackathon"] },
      ],
    },
  ];

  let sheet = PROMPTS;

  const FLAVORS = [
    { at: 0.04, side: "left", text: "── the carillon starts" },
    { at: 0.14, side: "right", text: "memorial room windows ──" },
    { at: 0.26, side: "left", text: "── most of the daylight stops here" },
    { at: 0.38, side: "right", text: "THE GOTHIC SHAFT ──", zone: true },
    { at: 0.5, side: "left", text: "── stone grotesques" },
    { at: 0.62, side: "right", text: "branford gate ──" },
    { at: 0.74, side: "left", text: "── the courtyard" },
    { at: 0.84, side: "right", text: "BENEATH BRANFORD ──", zone: true },
    { at: 0.94, side: "left", text: "── the crypt. a perfect descent ends here." },
  ];

  const state = {
    screen: "boot",
    index: 0,
    score: 0,
    depth: 0,
    displayDepth: 0,
    results: [],
    muted: localStorage.getItem("yalieon-mute") === "1",
    coat: localStorage.getItem("yalieon-coat") || "classic",
    phaseUntil: 0,
    raf: 0,
    lastTyped: "",
    locked: false,
  };

  const $ = (id) => document.getElementById(id);
  let audioCtx = null;

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function normalize(raw) {
    return String(raw || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^(the|a|an) /, "");
  }

  function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (!m) return n;
    if (!n) return m;
    const row = new Array(n + 1);
    for (let j = 0; j <= n; j++) row[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = i - 1;
      row[0] = i;
      for (let j = 1; j <= n; j++) {
        const cur = row[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
        prev = cur;
      }
    }
    return row[n];
  }

  function limitFor(alias) {
    if (alias.length <= 4) return 0;
    if (alias.length <= 7) return 1;
    return 2;
  }

  function matchAnswer(prompt, raw) {
    const typed = normalize(raw);
    if (!typed) return null;
    let best = null;
    let bestDist = Infinity;
    let ties = 0;
    prompt.answers.forEach((entry) => {
      entry.aliases.forEach((alias) => {
        const key = normalize(alias);
        const dist = key === typed ? 0 : levenshtein(typed, key);
        const limit = key === typed ? 0 : limitFor(key);
        if (dist > limit) return;
        if (Math.abs(typed.length - key.length) > limit + 1) return;
        if (dist < bestDist) {
          bestDist = dist;
          best = entry;
          ties = 1;
        } else if (dist === bestDist && entry !== best) {
          ties += 1;
        }
      });
    });
    if (ties > 1 && bestDist > 0) return null;
    return best;
  }

  function dogSVG() {
    return `<img class="bulldog" src="bulldog.png" alt="" draggable="false">`;
  }

  function harvardSVG(c) {
    const cell = c || 4;
    const rows = [
      "..cccccc..",
      ".cccccccc.",
      "cc.WW.WWcc",
      "cc.WW.WWcc",
      "cc.WWWW.cc",
      "cc.WW.WWcc",
      "cc.WW.WWcc",
      "cc......cc",
      ".cccccccc.",
      "..cccccc..",
      "...cccc...",
      "....cc....",
    ];
    let rects = "";
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === ".") return;
        const fill = ch === "W" ? "#f4f1ea" : "#A51C30";
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fill}"/>`;
      });
    });
    return `<svg viewBox="0 0 ${rows[0].length * cell} ${rows.length * cell}" width="${rows[0].length * cell}" height="${rows.length * cell}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }

  function hash(x, y) {
    return ((x * 374761393) ^ (y * 668265263)) >>> 0;
  }

  function buildTower() {
    const COLS = 33;
    const ROWS = 470;
    const cell = 4;
    const mid = 16;
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const palettes = [
      ["#e4eaf1", "#d5dce6", "#c5ceda", "#b4c0ce"],
      ["#b7c2d0", "#a3b0c0", "#8f9eb0", "#7d8da2"],
      ["#6d7e94", "#5c6e86", "#4c5e76", "#3e5068"],
      ["#31445c", "#28384e", "#1e2c40", "#172433"],
    ];

    function stone(x, y, shade) {
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      const p = palettes[Math.max(0, Math.min(3, shade))];
      grid[y][x] = p[hash(x, y) % p.length];
    }

    grid[0][mid] = "#4d9bff";
    grid[1][mid] = "#1c2a3e";
    grid[2][mid] = "#1c2a3e";
    grid[1][mid + 1] = "#00356b";
    grid[1][mid + 2] = "#f4f7fb";
    grid[2][mid + 1] = "#00356b";

    for (let y = 4; y < 36; y++) {
      const half = 2 + Math.floor((y - 4) / 5);
      for (let x = mid - half; x <= mid + half; x++) {
        const edge = x === mid - half || x === mid + half || y === 4;
        if (edge) grid[y][x] = "#243246";
        else stone(x, y, 1);
      }
    }

    for (let y = 36; y < 86; y++) {
      const half = 8;
      for (let x = mid - half; x <= mid + half; x++) {
        const edge = x <= mid - half + 1 || x >= mid + half - 1;
        const inArch = y > 48 && y < 80 && (Math.abs(x - (mid - 4)) <= 1 || Math.abs(x - (mid + 4)) <= 1);
        const opening = y > 52 && y < 78 && (Math.abs(x - (mid - 4)) === 0 || Math.abs(x - (mid + 4)) === 0);
        if (opening) grid[y][x] = y < 60 ? "#1a2740" : "#f0d48a";
        else if (edge) grid[y][x] = "#243246";
        else if (inArch) stone(x, y, 1);
        else stone(x, y, 1);
      }
    }

    for (let y = 86; y < 96; y++) {
      const half = y % 2 === 0 ? 10 : 8;
      for (let x = mid - half; x <= mid + half; x++) stone(x, y, 1);
    }

    for (let y = 96; y < 420; y++) {
      const t = (y - 96) / (420 - 96);
      const shade = t < 0.28 ? 1 : t < 0.55 ? 2 : 3;
      const half = 9;
      for (let x = mid - half; x <= mid + half; x++) {
        const edge = x <= mid - half || x >= mid + half;
        stone(x, y, edge ? Math.min(3, shade + 1) : shade);
      }
      if ((y - 100) % 34 === 0) {
        for (let x = mid - half; x <= mid + half; x++) stone(x, y, Math.min(3, shade + 1));
      }
      const local = (y - 108) % 28;
      if (local >= 0 && local < 12) {
        [mid - 4, mid + 3].forEach((wx) => {
          if (local === 0) {
            stone(wx, y, shade);
            stone(wx + 1, y, shade);
          } else {
            const deep = t > 0.72;
            grid[y][wx] = deep ? "#15263a" : local < 3 ? "#2a4060" : "#f3d48a";
            grid[y][wx + 1] = deep ? "#101c2c" : "#e7c56a";
          }
        });
      }
      if ((y - 130) % 56 === 0) {
        stone(mid - half - 1, y, 2);
        stone(mid + half + 1, y, 2);
        stone(mid - half - 2, y, 3);
        stone(mid + half + 2, y, 3);
        grid[y][mid - half - 2] = "#3e4c5e";
        grid[y][mid + half + 2] = "#3e4c5e";
      }
    }

    for (let y = 420; y < ROWS; y++) {
      const half = 13;
      for (let x = mid - half; x <= mid + half; x++) stone(x, y, 3);
    }
    for (let y = 436; y < 464; y++) {
      for (let x = mid - 3; x <= mid + 2; x++) grid[y][x] = y < 442 ? "#121820" : "#1a0c10";
    }
    grid[452][mid] = "#ffd166";
    grid[452][mid - 1] = "#a51c30";

    let rects = "";
    for (let y = 0; y < ROWS; y++) {
      let x = 0;
      while (x < COLS) {
        const color = grid[y][x];
        if (!color) {
          x += 1;
          continue;
        }
        let x2 = x + 1;
        while (x2 < COLS && grid[y][x2] === color) x2 += 1;
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${(x2 - x) * cell}" height="${cell}" fill="${color}"/>`;
        x = x2;
      }
    }
    const w = COLS * cell;
    const h = ROWS * cell;
    $("tower-mount").innerHTML = `<svg class="tower" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${rects}</svg>`;

    const mountTop = 220;
    const box = $("flavors");
    box.innerHTML = "";
    FLAVORS.forEach((f) => {
      const node = el("div", "flavor " + f.side + (f.zone ? " zone" : ""), f.text);
      node.style.top = mountTop + (96 + f.at * (420 - 96)) * cell + "px";
      box.appendChild(node);
    });
  }

  function layout() {
    const mount = $("tower-mount");
    const cell = 4;
    const towerTop = 220;
    const roof = towerTop + 36 * cell;
    const crown = roof - 58;
    const foot = towerTop + 430 * cell;
    const t = state.displayDepth / 700;
    const eased = Math.pow(t, 0.62);
    const dogY = crown + (foot - crown) * eased;
    const dog = $("dog");
    const svg = mount.querySelector("svg");
    const worldRect = $("world").getBoundingClientRect();
    const towerRect = svg.getBoundingClientRect();
    const towerLeft = towerRect.left - worldRect.left;
    dog.style.top = dogY + "px";
    dog.style.left = towerLeft - 36 + "px";
    let cam = 0;
    if (state.screen !== "home" && state.screen !== "boot" && state.displayDepth > 0) {
      cam = Math.max(0, dogY - window.innerHeight * 0.42);
    }
    $("world").style.transform = `translateY(${-cam}px)`;
    const deep = state.displayDepth / 700;
    $("shade-deep").style.opacity = String(Math.min(0.88, deep * 0.92));
    dog.classList.toggle("idle", state.screen === "home" || (state.screen !== "result" && state.displayDepth === 0));
    renderRuler();
  }

  function renderRuler() {
    const ruler = $("ruler");
    const playing = state.screen === "play" || state.screen === "preview" || state.screen === "result" || state.screen === "end";
    const start = playing ? Math.max(0, state.displayDepth - 40) : 0;
    const span = 340;
    ruler.innerHTML = "";
    for (let ft = Math.ceil(start / 50) * 50; ft <= start + span && ft <= 700; ft += 50) {
      const tick = el("div", "ruler-tick", ft === 0 ? "0 ft" : String(ft));
      tick.style.top = ((ft - start) / span) * 100 + "%";
      ruler.appendChild(tick);
    }
    if (playing && state.displayDepth > 0) {
      const you = el("div", "ruler-you", "YOU");
      const pct = Math.max(0, Math.min(1, (state.displayDepth - start) / span));
      you.style.top = pct * 100 + "%";
      ruler.appendChild(you);
    }
  }

  function paintTitle(text) {
    const h = $("title");
    h.innerHTML = "";
    [...text].forEach((ch, i) => {
      const s = el("span", null, ch);
      s.style.animationDelay = i * 0.12 + "s";
      h.appendChild(s);
    });
  }

  function speakerIcon(on) {
    $("sound-btn").innerHTML = on
      ? '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M2 6h3l4-3v10L5 10H2V6zm8 .2v3.6a3 3 0 0 0 0-3.6zM10 3a6 6 0 0 1 0 10V3z"/></svg>'
      : '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M2 6h3l4-3v10L5 10H2V6zM11 6l3 4m0-4-3 4" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>';
    $("sound-btn").setAttribute("aria-pressed", on ? "false" : "true");
    $("sound-btn").setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
  }

  function setCoat(coat) {
    state.coat = coat;
    localStorage.setItem("yalieon-coat", coat);
    $("dog").classList.remove("coat-classic", "coat-blue", "coat-gold");
    $("dog").classList.add("coat-" + coat);
  }

  function show(id) {
    ["home", "play", "end"].forEach((key) => {
      $(key).hidden = key !== id;
    });
  }

  function openMenu(open) {
    $("menu").hidden = !open;
    $("menu-btn").setAttribute("aria-expanded", open ? "true" : "false");
    $("menu-btn").setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  function closePop() {
    $("pop").hidden = true;
  }

  function openPop(title, fill) {
    $("pop-title").textContent = title;
    const body = $("pop-body");
    body.innerHTML = "";
    fill(body);
    $("pop").hidden = false;
  }

  function panel(name) {
    openMenu(false);
    if (name === "settings") return openSettings();
    if (name === "wardrobe") return openWardrobe();
    if (name === "privacy") {
      return openPop("Privacy", (body) => {
        body.appendChild(el("p", null, "This demo keeps your best descent, your coat, and your sound setting on this machine. Nothing leaves the tower."));
      });
    }
    if (name === "faq") {
      return openPop("FAQ", (body) => {
        const bits = [
          ["What is a descent?", "Seven prompts. One answer each. The rarer it is, the farther the bulldog drops. 700 feet is the crypt."],
          ["What is Too Clever Eli?", "The answer that feels like a deep cut and is not. The whole college already said it."],
          ["What is Raritas?", "Uncommon, and still something a student would actually say. Deep Cut Dog and One in a Yalion go deeper."],
          ["What is Harvard?", "The worst. Empty, late, or not on the sheet. The bulldog stays put."],
          ["Why this answer and not mine?", "The sheet is a short campus set for the demo, not the whole of Yale."],
        ];
        bits.forEach(([q, a]) => {
          body.appendChild(el("p", null, q));
          body.appendChild(el("p", null, a));
        });
      });
    }
    if (name === "archive") {
      return openPop("Archive", (body) => {
        body.appendChild(el("p", null, "The logbook is carved under Branford. This demo only keeps the descent in front of you."));
        body.appendChild(el("p", null, "Descent #" + DESCENT_NO + " is today's stair."));
      });
    }
    if (name === "packs") {
      return openPop("Themed packs", (body) => {
        [["Old Campus", "soon"], ["Butteries at 1 a.m.", "soon"], ["Secret societies", "soon"], ["The playlist", "soon"]].forEach(([name, tag]) => {
          const row = el("div", "pack");
          row.appendChild(el("strong", null, name));
          row.appendChild(el("span", null, tag));
          body.appendChild(row);
        });
      });
    }
    if (name === "party") {
      return openPop("Boola Party", (body) => {
        body.appendChild(el("p", null, "A bulldog gets passed around the room. The fuse is short. When it pops, everybody drops a floor."));
        body.appendChild(el("p", null, "Beta. The party is still on the stair."));
      });
    }
    if (name === "friends") {
      return openPop("Friends", (body) => {
        body.appendChild(el("p", null, "No one else is on the stair yet. When they are, you'll see how far their bulldog got."));
      });
    }
    if (name === "me") {
      const best = localStorage.getItem("yalieon-best");
      return openPop("My Yalieon", (body) => {
        body.appendChild(el("p", null, best ? "Deepest so far: " + best + " ft." : "You have not reached the bearing yet."));
        body.appendChild(el("p", null, "Coat: " + state.coat + "."));
      });
    }
    if (name === "daily" || name === "unlimited") {
      closePop();
      startDescent();
    }
  }

  function openSettings() {
    openPop("Settings", (body) => {
      const btn = el("button", "wide", state.muted ? "Sound off" : "Sound on");
      btn.type = "button";
      btn.addEventListener("click", () => {
        toggleMute();
        btn.textContent = state.muted ? "Sound off" : "Sound on";
      });
      body.appendChild(btn);
      body.appendChild(el("p", null, "One descent. Seven prompts. The sheet does not change until you climb back up."));
    });
  }

  function openWardrobe() {
    openPop("Wardrobe", (body) => {
      [["classic", "Classic coat"], ["blue", "Yale blue scarf"], ["gold", "Gold collar"]].forEach(([id, label]) => {
        const btn = el("button", "choice", label);
        btn.type = "button";
        btn.setAttribute("aria-pressed", state.coat === id ? "true" : "false");
        btn.addEventListener("click", () => {
          setCoat(id);
          body.querySelectorAll(".choice").forEach((n) => n.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
          blip(520, 0.06, "square", 0.03);
        });
        body.appendChild(btn);
      });
    });
  }

  function toggleMute() {
    state.muted = !state.muted;
    localStorage.setItem("yalieon-mute", state.muted ? "1" : "0");
    speakerIcon(!state.muted);
    if (state.muted) stopSong();
    else playBulldogSong();
  }

  let songNodes = [];

  function stopSong() {
    songNodes.forEach((node) => {
      try { node.stop(); } catch (err) { /* already stopped */ }
    });
    songNodes = [];
  }

  function playBulldogSong() {
    const ctx = ensureAudio();
    if (!ctx) return;
    stopSong();
    const beat = 0.2;
    const notes = [
      392, 392, 392, 392, 329.63, 349.23, 392, 392, 440, 392, 329.63, 329.63,
      392, 392, 392, 392, 329.63, 349.23, 392, 392, 523.25, 523.25, 523.25, 523.25,
      523.25, 523.25, 523.25, 587.33, 659.25, 587.33, 523.25, 523.25, 493.88, 440, 392, 392,
      440, 392, 349.23, 329.63, 293.66, 293.66,
      392, 392, 392, 392, 329.63, 349.23, 392, 392, 523.25, 523.25, 523.25, 523.25,
    ];
    const held = new Set([7, 11, 18, 23, 30, 35, 39, 41, 46, 51]);
    let time = ctx.currentTime + 0.05;
    notes.forEach((freq, i) => {
      const dur = (held.has(i) ? 2 : 1) * beat;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(0.0001, time);
      amp.gain.exponentialRampToValueAtTime(0.04, time + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.03);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
      songNodes.push(osc);
      time += dur;
    });
  }

  function ensureAudio() {
    if (state.muted) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function blip(freq, dur, type, gain) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    amp.gain.value = gain || 0.03;
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  }

  function chord(freqs) {
    freqs.forEach((f, i) => setTimeout(() => blip(f, 0.12, "square", 0.03), i * 70));
  }

  function renderPips() {
    const row = $("pip-row");
    row.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      const pip = el("i", "pip");
      if (i < state.results.length) {
        pip.classList.add("done");
        pip.style.background = TIERS[state.results[i].tier].color;
      } else if (i === state.index && state.screen !== "end") {
        pip.classList.add("on");
      }
      row.appendChild(pip);
    }
    const n = Math.min(state.index + 1, 7);
    const label = "PROMPT " + n + " OF 7";
    $("pip-label").textContent = label;
    $("kicker").textContent = label;
  }

  function renderHud() {
    $("depth-value").textContent = Math.round(state.displayDepth) + " ft";
    $("score-value").textContent = String(state.score);
    renderPips();
  }

  const TIER_IDS = new Set(["prefrosh", "tooblue", "college", "oldblue", "deepcut", "yalieon"]);

  function descentNumber(day) {
    const today = day || new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const start = Date.parse("2026-07-16T00:00:00Z");
    const now = Date.parse(today + "T00:00:00Z");
    if (!Number.isFinite(now)) return 125;
    return Math.max(1, Math.floor((now - start) / 86400000) + 1);
  }

  function sanitizeSheet(list) {
    if (!Array.isArray(list) || list.length < 7) return null;
    const next = [];
    for (const prompt of list.slice(0, 7)) {
      if (!prompt || typeof prompt.text !== "string") return null;
      const text = prompt.text.trim();
      if (text.length < 8 || text.length > 160) return null;
      if (!Array.isArray(prompt.answers)) return null;
      const answers = [];
      prompt.answers.slice(0, 24).forEach((entry) => {
        if (!entry || !TIER_IDS.has(entry.tier) || !Array.isArray(entry.aliases)) return;
        const aliases = entry.aliases
          .filter((alias) => typeof alias === "string")
          .map((alias) => alias.trim())
          .filter((alias) => alias && alias.length < 80)
          .slice(0, 12);
        if (aliases.length) answers.push({ tier: entry.tier, aliases });
      });
      if (answers.length < 2) return null;
      next.push({
        text,
        gem: typeof prompt.gem === "string" ? prompt.gem.slice(0, 180) : "One in a Yalion.",
        answers,
      });
    }
    return next.length === 7 ? next : null;
  }

  function applyDaily(data) {
    const label = document.querySelector(".descent-no");
    if (label) label.textContent = "DESCENT #" + (data && data.descent ? data.descent : descentNumber());
  }

  const dailyReady = (function loadDaily() {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    return fetch("/api/daily", { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => applyDaily(data))
      .catch(() => applyDaily(null))
      .finally(() => clearTimeout(timer));
  })();

  function showHome() {
    stopLoop();
    state.screen = "home";
    state.displayDepth = 0;
    state.depth = 0;
    show("home");
    $("play").hidden = true;
    $("end").hidden = true;
    layout();
  }

  async function startDescent() {
    await dailyReady;
    ensureAudio();
    playBulldogSong();
    stopLoop();
    state.index = 0;
    state.score = 0;
    state.depth = 0;
    state.displayDepth = 0;
    state.results = [];
    state.screen = "preview";
    show("play");
    $("home").hidden = true;
    $("end").hidden = true;
    $("result-card").hidden = true;
    $("prompt-card").hidden = false;
    $("dock").hidden = false;
    beginPrompt();
  }

  function beginPrompt() {
    state.locked = false;
    state.lastTyped = "";
    state.screen = "preview";
    state.phaseUntil = performance.now() + PREVIEW_MS;
    const prompt = sheet[state.index];
    $("prompt-text").textContent = prompt.text;
    $("prompt-card").hidden = false;
    $("result-card").hidden = true;
    $("dock").hidden = false;
    $("reject").hidden = true;
    const input = $("answer-input");
    input.value = "";
    input.disabled = true;
    input.placeholder = "get ready…";
    $("dive-btn").disabled = true;
    renderHud();
    layout();
    loop();
  }

  function armPlay() {
    state.screen = "play";
    state.phaseUntil = performance.now() + PLAY_MS;
    const input = $("answer-input");
    input.disabled = false;
    input.placeholder = "type one answer...";
    $("dive-btn").disabled = false;
    input.focus();
    blip(480, 0.05, "square", 0.025);
  }

  function loop() {
    cancelAnimationFrame(state.raf);
    const frame = (now) => {
      if (state.screen === "preview" && now >= state.phaseUntil) armPlay();
      if (state.screen === "play" && now >= state.phaseUntil) {
        timeout();
        return;
      }
      paintTimer(now);
      if (state.screen === "preview" || state.screen === "play") state.raf = requestAnimationFrame(frame);
    };
    state.raf = requestAnimationFrame(frame);
  }

  function stopLoop() {
    cancelAnimationFrame(state.raf);
  }

  let lastTick = null;

  function paintTimer(now) {
    const ring = $("timer-ring");
    const num = $("timer-num");
    const timer = $("timer");
    if (state.screen === "preview") {
      const left = Math.max(0, state.phaseUntil - now);
      num.textContent = String(Math.ceil(left / 1000));
      ring.style.strokeDashoffset = "0";
      timer.classList.remove("low");
      $("track-bar").style.width = "100%";
      return;
    }
    if (state.screen !== "play") return;
    const left = Math.max(0, state.phaseUntil - now);
    const secs = Math.ceil(left / 1000);
    num.textContent = String(secs);
    const pct = left / PLAY_MS;
    ring.style.strokeDasharray = String(RING);
    ring.style.strokeDashoffset = String(RING * (1 - pct));
    $("track-bar").style.width = pct * 100 + "%";
    timer.classList.toggle("low", secs <= 5);
    if (secs <= 5 && secs !== lastTick) {
      lastTick = secs;
      blip(220, 0.03, "square", 0.02);
    }
  }

  function submitAnswer(raw) {
    if (state.screen !== "play" || state.locked) return;
    const text = String(raw || "").trim();
    state.lastTyped = text;
    if (!text) {
      if (state.index === 6) accept("harvard", "nothing");
      else reject();
      return;
    }
    const hit = matchAnswer(sheet[state.index], text);
    if (!hit) {
      reject();
      return;
    }
    accept(hit.tier, text);
  }

  function reject() {
    $("reject").hidden = false;
    const field = $("field");
    field.classList.remove("shake");
    void field.offsetWidth;
    field.classList.add("shake");
    blip(110, 0.08, "sawtooth", 0.02);
  }

  function timeout() {
    if (state.locked || state.screen !== "play") return;
    const pending = $("answer-input").value.trim();
    const hit = pending ? matchAnswer(sheet[state.index], pending) : null;
    if (hit) accept(hit.tier, pending);
    else accept("harvard", pending || "nothing");
  }

  function accept(tierId, typed) {
    state.locked = true;
    stopLoop();
    const tier = TIERS[tierId];
    const from = state.depth;
    state.results.push({ tier: tierId, text: typed, points: tier.points });
    state.score += tier.points;
    state.depth += tier.points;
    state.screen = "result";
    $("prompt-card").hidden = true;
    $("dock").hidden = true;
    $("result-card").hidden = false;
    $("tier-name").textContent = tier.name;
    $("tier-name").style.color = tier.color;
    $("result-answer").textContent = "“" + typed + "”";
    $("result-points").style.color = tier.color;
    $("result-points").textContent = tier.points === 0 ? "+0 PTS · nowhere" : "+" + tier.points + " PTS · drop " + tier.points + " ft";
    const prompt = sheet[state.index];
    $("result-line").textContent = tierId === "yalieon" ? prompt.gem : tier.line;
    const mark = $("result-mark");
    mark.innerHTML = "";
    if (tierId === "harvard") {
      mark.innerHTML = harvardSVG(4);
      $("dog").classList.remove("idle");
      $("dog").classList.add("shake");
      setTimeout(() => $("dog").classList.remove("shake"), 400);
      blip(90, 0.14, "square", 0.04);
      setTimeout(() => blip(70, 0.18, "square", 0.03), 120);
    } else {
      mark.innerHTML = dogSVG(4);
      if (tierId === "yalieon") chord([523, 659, 784, 1046]);
      else blip(360 + tier.points, 0.09, "square", 0.035);
    }
    $("descend-btn").textContent = state.index === 6 ? "THE BEARING ▼" : "DESCEND ▼";
    renderHud();
    animateDepth(from, state.depth);
    $("descend-btn").focus();
  }

  function animateDepth(from, to) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || from === to) {
      state.displayDepth = to;
      layout();
      renderHud();
      return;
    }
    const t0 = performance.now();
    const dur = 650 + Math.min(700, (to - from) * 6);
    const step = (now) => {
      const u = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - u, 3);
      state.displayDepth = from + (to - from) * e;
      layout();
      renderHud();
      if (u < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function next() {
    blip(300, 0.06, "square", 0.03);
    if (state.index >= 6) {
      showEnd();
      return;
    }
    state.index += 1;
    beginPrompt();
  }

  function erf(x) {
    const sign = Math.sign(x);
    const a = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * a);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-a * a);
    return sign * y;
  }

  function percentile(score) {
    const z = (score - 310) / 150;
    const p = 0.5 * (1 + erf(z / Math.SQRT2));
    return Math.max(1, Math.min(99, Math.round(p * 100)));
  }

  function bearing(score) {
    if (score >= 450) return { range: "450+", line: "One in a Yalion. The crypt. Almost nobody walks out this far." };
    if (score >= 351) return { range: "351–449", line: "Deep Cut Dog. The shaft knows your name." };
    if (score >= 251) return { range: "251–350", line: "Raritas. Well below the bells." };
    if (score >= 151) return { range: "151–250", line: "Bulldog Schooler. A respectable stair, and a crowded one." };
    if (score >= 70) return { range: "70–150", line: "Common Crimson. Plenty of tower left." };
    return { range: "0–69", line: "Harvard. The worst of the tower." };
  }

  function showEnd() {
    stopLoop();
    state.screen = "end";
    state.displayDepth = state.depth;
    $("play").hidden = true;
    $("home").hidden = true;
    const end = $("end");
    end.hidden = false;
    end.innerHTML = "";
    const inner = el("div", "end-inner");
    const top = el("div", "end-top");
    top.appendChild(el("h2", "end-title", "YALIEON"));
    top.appendChild(el("p", "end-complete", "DESCENT #" + DESCENT_NO + " COMPLETE"));
    inner.appendChild(top);

    const hero = el("div", "score-hero");
    hero.appendChild(el("p", "score-ghost", "THE DAILY DESCENT"));
    hero.appendChild(el("p", "score-big", String(state.score)));
    hero.appendChild(el("p", "score-drop", "−" + state.score + " ft"));
    inner.appendChild(hero);

    inner.appendChild(curveSVG(state.score));
    inner.appendChild(el("p", "better", "BETTER THAN " + percentile(state.score) + "% OF TODAY'S PLAYERS"));

    const logHead = el("div", "log-head");
    logHead.appendChild(document.createTextNode("DESCENT LOG"));
    logHead.appendChild(el("span", null, "DEEPER = RARER"));
    inner.appendChild(logHead);
    inner.appendChild(logChart());

    const band = bearing(state.score);
    const head = el("div", "bearing-head");
    head.appendChild(document.createTextNode("THE BEARING"));
    inner.appendChild(head);
    const row = el("div", "bearing");
    row.appendChild(el("span", "range", band.range));
    const mark = el("span");
    mark.innerHTML = state.score === 0 ? harvardSVG(2) : dogSVG(2);
    row.appendChild(mark);
    row.appendChild(el("p", null, band.line));
    inner.appendChild(row);

    const again = el("button", "begin again", "▲ BACK TO THE CROWN ▲");
    again.type = "button";
    again.addEventListener("click", showHome);
    inner.appendChild(again);
    end.appendChild(inner);

    const prev = Number(localStorage.getItem("yalieon-best") || 0);
    if (state.score > prev) localStorage.setItem("yalieon-best", String(state.score));
    layout();
    end.scrollTop = 0;
  }

  function curveSVG(score) {
    const wrap = el("div", "curve-wrap");
    const w = 700;
    const h = 168;
    const pts = [];
    let max = 0.0001;
    for (let x = 0; x <= 700; x += 8) {
      const z = (x - 310) / 150;
      const y = Math.exp(-0.5 * z * z);
      if (y > max) max = y;
      pts.push([x, y]);
    }
    const X = (x) => 28 + (x / 700) * (w - 56);
    const Y = (y) => 16 + (1 - y / max) * 96;
    const coords = pts.map(([x, y]) => X(x).toFixed(1) + "," + Y(y).toFixed(1)).join(" ");
    const mx = X(score);
    const mz = (score - 310) / 150;
    const my = Y(Math.exp(-0.5 * mz * mz));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML =
      `<line x1="28" y1="112" x2="${w - 28}" y2="112" stroke="rgba(150,176,204,0.35)" stroke-width="1"/>` +
      `<polyline points="${coords}" fill="none" stroke="#7ec8ff" stroke-width="3"/>` +
      `<line x1="${mx}" y1="${my}" x2="${mx}" y2="112" stroke="#ff7a93" stroke-width="2"/>` +
      `<circle cx="${mx}" cy="${my}" r="4" fill="#ff7a93"/>` +
      `<text x="${mx}" y="128" text-anchor="middle" fill="#ff7a93" font-family="VT323, monospace" font-size="16">YOU</text>` +
      [0, 100, 200, 300, 400, 500, 600, 700].map((n) => {
        return `<text x="${X(n)}" y="152" text-anchor="middle" fill="#8ea6c0" font-family="VT323, monospace" font-size="14">${n}</text>`;
      }).join("");
    wrap.appendChild(svg);
    return wrap;
  }

  function logChart() {
    const chart = el("div", "log-chart");
    const grid = el("div", "log-grid");
    [0, 25, 50, 75, 100].forEach((n) => {
      const line = el("div", "log-line");
      line.style.top = (n / 100) * 100 + "%";
      const scale = el("div", "log-scale", n === 0 ? "0" : "−" + n);
      scale.style.top = (n / 100) * 100 + "%";
      grid.appendChild(line);
      grid.appendChild(scale);
    });
    chart.appendChild(grid);
    const cols = el("div", "log-cols");
    state.results.forEach((r, i) => {
      const col = el("div", "log-col");
      const drop = el("div", "log-drop");
      drop.style.height = r.points + "%";
      drop.style.background = TIERS[r.tier].color;
      const mark = el("div", "log-mark");
      mark.style.top = r.points + "%";
      mark.innerHTML = r.tier === "harvard" ? harvardSVG(2) : dogSVG(2);
      const num = el("div", "log-num", String(i + 1));
      col.appendChild(drop);
      col.appendChild(mark);
      col.appendChild(num);
      cols.appendChild(col);
    });
    chart.appendChild(cols);
    return chart;
  }

  function bind() {
    paintTitle("YALIEON");
    $("dog").innerHTML = dogSVG(4);
    $("party-dog").innerHTML = dogSVG(2);
    setCoat(state.coat);
    speakerIcon(!state.muted);
    buildTower();

    const links = [
      ["daily", "", "Daily descent"],
      ["unlimited", "∞", "Unlimited"],
      ["party", "", "Boola Party"],
      ["archive", "⟲", "Archive"],
      ["packs", "", "Themed packs"],
      ["me", "", "My Yalieon"],
      ["friends", "", "Friends"],
      ["settings", "", "Settings"],
      ["faq", "", "FAQ"],
    ];
    const box = $("menu-links");
    links.forEach(([id, sym, label]) => {
      const btn = el("button");
      btn.type = "button";
      if (sym) btn.appendChild(el("span", "sym", sym));
      btn.appendChild(document.createTextNode(label));
      btn.addEventListener("click", () => panel(id));
      box.appendChild(btn);
    });

    $("menu-btn").addEventListener("click", () => openMenu($("menu").hidden));
    $("menu-x").addEventListener("click", () => openMenu(false));
    $("menu").addEventListener("click", (e) => {
      if (e.target === $("menu")) openMenu(false);
    });
    $("sound-btn").addEventListener("click", () => {
      toggleMute();
    });
    $("settings-btn").addEventListener("click", () => {
      if ($("pop").hidden || $("pop-title").textContent !== "Settings") openSettings();
      else closePop();
    });
    $("wardrobe-btn").addEventListener("click", () => {
      if ($("pop").hidden || $("pop-title").textContent !== "Wardrobe") openWardrobe();
      else closePop();
    });
    $("pop-x").addEventListener("click", closePop);
    $("privacy-btn").addEventListener("click", () => panel("privacy"));
    $("party-btn").addEventListener("click", () => panel("party"));
    document.querySelectorAll("[data-panel]").forEach((btn) => {
      btn.addEventListener("click", () => panel(btn.getAttribute("data-panel")));
    });
    $("howto-toggle").addEventListener("click", () => {
      const list = $("howto");
      const open = list.hidden;
      list.hidden = !open;
      $("howto-toggle").setAttribute("aria-expanded", open ? "true" : "false");
      $("howto-toggle").textContent = (open ? "▾" : "▸") + " HOW TO PLAY";
    });
    $("begin-btn").addEventListener("click", startDescent);
    $("dock").addEventListener("submit", (e) => {
      e.preventDefault();
      submitAnswer($("answer-input").value);
    });
    $("answer-input").addEventListener("input", () => {
      $("reject").hidden = true;
    });
    $("descend-btn").addEventListener("click", next);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        openMenu(false);
        closePop();
      }
      if (e.key === "Enter" && state.screen === "result" && document.activeElement !== $("descend-btn")) {
        e.preventDefault();
        next();
      }
    });
    window.addEventListener("resize", layout);

    window.YALIEON = {
      state,
      startDescent,
      submitAnswer,
      timeout,
      next,
      matchAnswer,
      get prompts() { return sheet; },
      TIERS,
    };
  }

  bind();
  layout();
  setTimeout(() => {
    $("boot").hidden = true;
    showHome();
  }, 700);
})();
