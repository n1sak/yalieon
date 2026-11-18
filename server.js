/* Serves Yalieon and builds the day's prompts from Grok's live X search. */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 5173;
const DATA = path.join(ROOT, "data");

function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, "utf8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  });
}

loadEnv();

function nyDay() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function descentNumber(day) {
  const start = Date.parse("2026-07-16T00:00:00Z");
  const now = Date.parse(day + "T00:00:00Z");
  return Math.max(1, Math.floor((now - start) / 86400000) + 1);
}

const TIERS = new Set(["prefrosh", "tooblue", "college", "oldblue", "deepcut", "yalieon"]);

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
      if (!entry || !TIERS.has(entry.tier) || !Array.isArray(entry.aliases)) return;
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

function outputText(body) {
  if (body && typeof body.output_text === "string") return body.output_text;
  const chunks = [];
  (body.output || []).forEach((item) => {
    (item.content || []).forEach((part) => {
      if (typeof part.text === "string") chunks.push(part.text);
    });
  });
  return chunks.join("\n");
}

function parseSheet(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (err) {
    return null;
  }
}

function callGrok(day) {
  const prompt = [
    "You are filling answer sheets for Yalieon, a daily game for Yale students.",
    "Use X Search only to see what students are talking about. Do not write questions about a single post.",
    "Keep every prompt broad, the way a student would hear it in a dining hall.",
    "Use these seven prompt texts exactly, in this order:",
    "1. Name a Yale library",
    "2. Name a New Haven pizza place",
    "3. Name a place to study that isn't a library",
    "4. Name something students complain about with Yale dining",
    "5. Name a recent Yale student achievement people are talking about",
    "6. Name a residential college event or tradition from this week",
    "7. What are Yale students thinking about right now?",
    "",
    "Return ONLY JSON, no markdown:",
    '{ "headline": "one short clause a student would recognize", "prompts": [ exactly 7 ] }',
    "",
    "Each prompt is:",
    '{ "text": "one of the seven lines above, unchanged", "gem": "one sentence about the rarest good answer", "answers": [ { "tier": "prefrosh"|"tooblue"|"college"|"oldblue"|"deepcut"|"yalieon", "aliases": ["lowercase phrases a student would type"] } ] }',
    "",
    "Rules:",
    "- Answers are ordinary campus things: libraries, pizza places, study spots, dining complaints, achievements, college events, and what is on people's minds.",
    "- Do not ask what a specific post said. Do not use a private student's name.",
    "- prefrosh is Common Crimson, the answer everyone blurts out. tooblue is Too Clever Eli. college is Bulldog Schooler. oldblue is Raritas. deepcut is Deep Cut Dog. yalieon is One in a Yalion, the rarest answer.",
    "- Harvard is a miss and is not an answer on the sheet.",
  ].join("\n");

  const body = JSON.stringify({
    model: process.env.XAI_MODEL || "grok-4.7",
    max_turns: 3,
    input: [{ role: "user", content: prompt }],
    tools: [{ type: "x_search", from_date: day, to_date: addDays(day, 1) }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "api.x.ai",
      path: "/v1/responses",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.XAI_API_KEY,
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error("xAI " + res.statusCode));
          return;
        }
        try {
          resolve(JSON.parse(text));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.setTimeout(180000, () => req.destroy(new Error("xAI timeout")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

let inflight = null;

function getDaily() {
  const day = nyDay();
  const file = path.join(DATA, day + ".json");
  if (fs.existsSync(file)) {
    try {
      return Promise.resolve(JSON.parse(fs.readFileSync(file, "utf8")));
    } catch (err) {
      /* rebuild a broken cache */
    }
  }
  if (!process.env.XAI_API_KEY) {
    return Promise.resolve({ live: false, date: day, descent: descentNumber(day) });
  }
  if (!inflight) {
    inflight = callGrok(day).then((body) => {
      const parsed = parseSheet(outputText(body));
      const prompts = parsed && sanitizeSheet(parsed.prompts);
      const payload = prompts
        ? {
          live: true,
          date: day,
          descent: descentNumber(day),
          headline: parsed.headline ? String(parsed.headline).slice(0, 90) : "",
          prompts,
        }
        : { live: false, date: day, descent: descentNumber(day) };
      if (payload.live) {
        fs.mkdirSync(DATA, { recursive: true });
        fs.writeFileSync(file, JSON.stringify(payload));
      }
      return payload;
    }).catch((err) => {
      console.error("daily stream failed:", err.message);
      return { live: false, date: day, descent: descentNumber(day) };
    }).finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function sendFile(res, file) {
  const ext = path.extname(file);
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/daily") {
    getDaily().then((payload) => {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      res.end(JSON.stringify(payload));
    });
    return;
  }
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const file = path.resolve(ROOT, "." + pathname);
  const base = path.basename(file);
  const inside = file === ROOT || file.startsWith(ROOT + path.sep);
  const hidden = base === ".env" || base.startsWith(".env.") || file.startsWith(path.join(ROOT, "data") + path.sep);
  if (!inside || hidden) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  sendFile(res, file);
});

server.listen(PORT, () => {
  console.log("Yalieon http://localhost:" + PORT);
  console.log(process.env.XAI_API_KEY ? "Live X search is on." : "No XAI_API_KEY. The baked question bank will play.");
});
