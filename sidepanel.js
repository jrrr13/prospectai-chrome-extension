// ProspectAI v15

const PROFILE_KEY = "prospectai_v15_profile";
function saveProfile(p) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }
function loadProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; } catch { return null; } }

const state = { theme: "sharp", lang: "mixed" };

const SEA_COUNTRIES = {
  indonesia:   ["indonesia","jakarta","surabaya","bandung","bali","medan"],
  singapore:   ["singapore"],
  malaysia:    ["malaysia","kuala lumpur","kl","penang","johor"],
  philippines: ["philippines","manila","cebu","makati"],
  vietnam:     ["vietnam","ho chi minh","hanoi","hcmc"],
  thailand:    ["thailand","bangkok"],
  myanmar:     ["myanmar","yangon"],
  cambodia:    ["cambodia","phnom penh"],
  laos:        ["laos","vientiane"],
  brunei:      ["brunei"],
  timorleste:  ["timor-leste","timor leste","dili","east timor"],
};
function detectCountry(loc) {
  const s = (loc||"").toLowerCase();
  for (const [c,kws] of Object.entries(SEA_COUNTRIES)) if (kws.some(k=>s.includes(k))) return c;
  return "general";
}
const FLAGS = { indonesia:"🇮🇩",singapore:"🇸🇬",malaysia:"🇲🇾",philippines:"🇵🇭",vietnam:"🇻🇳",thailand:"🇹🇭",myanmar:"🇲🇲",cambodia:"🇰🇭",laos:"🇱🇦",brunei:"🇧🇳",timorleste:"🇹🇱",general:"🌏" };

function getThemeModifier(theme) {
  return {
    sharp: `TONE: SHARP
Start with the pain. No preamble.
Be direct and confident. Sound like a peer, not a vendor.
LinkedIn and WhatsApp: one clear point, one question, nothing else.
No compliments. No exclamation marks. No filler sentences.`,
    warm: `TONE: WARM
Open with something real and specific about them or their situation.
Frame pain as a shared challenge, not their fault.
Sound like someone who has worked in their world before.
No hollow warmth. No over-enthusiasm. No exclamation marks.`,
    curious: `TONE: CURIOUS
Open with a question or an unexpected observation.
Do not reveal the full picture yet. Make them want to reply to find out more.
LinkedIn: one pointed question only. No product mention.
No exclamation marks. No buzzwords.`,
  }[theme] || "";
}

function getLangModifier(lang, country) {
  if (lang === "english") {
    return `LANGUAGE: ENGLISH ONLY
Every word in all three messages must be English. No exceptions.
Do not use any of these or anything like them: Pak, Ibu, Halo, Kính gửi, Anh, Chị, Sawasdee, Khun, Krub, Kha, Salamat, Po, Pasensya, Trân trọng, Salam hangat.
Email: open directly with the pain hook. No foreign greeting.
WhatsApp and LinkedIn: open with "Hi [FirstName],"
Sign off with "Best," or "Thanks,"`;
  }
  if (lang === "local") {
    return `LANGUAGE: FULL LOCAL
Write every part of every message in the local language of ${country.toUpperCase()}.
Indonesia: full Bahasa Indonesia. English only for brand or product names with no local form.
Vietnam: full Vietnamese.
Thailand: full Thai.
Philippines: full Tagalog or natural Taglish throughout.
Malaysia: Malay or Manglish with lah, kan, ah throughout.
Singapore: Singlish with lah, lor, meh, sia throughout.
General: warm plain English.
Every line — opener, body, CTA, sign-off — must be in the local language.`;
  }
  const g = {
    indonesia:   { email: `"Pak [FirstName]," or "Ibu [FirstName],"`, social: `"Halo Pak [FirstName]," or "Halo Ibu [FirstName],"` },
    vietnam:     { email: `"Kính gửi Anh [Name]," or "Kính gửi Chị [Name],"`, social: `"Kính gửi Anh/Chị [Name],"` },
    thailand:    { email: `"Sawasdee krub/kha, Khun [FirstName],"`, social: `"Sawasdee krub/kha, Khun [FirstName],"` },
    philippines: { email: `"Hi [FirstName],"`, social: `"Hi [FirstName]! Pasensya na sa abala,"` },
    malaysia:    { email: `"Hi [FirstName],"`, social: `"Hi [FirstName],"` },
    singapore:   { email: `"Hi [FirstName],"`, social: `"Hi [FirstName],"` },
    general:     { email: `"Hi [FirstName],"`, social: `"Hi [FirstName],"` },
  }[country] || { email: `"Hi [FirstName],"`, social: `"Hi [FirstName],"` };
  const s = { indonesia:"Salam hangat,", vietnam:"Trân trọng,", thailand:"Khob khun krub/kha,", philippines:"Salamat po,", malaysia:"Thanks,", singapore:"Cheers,", general:"Best," }[country] || "Best,";
  return `LANGUAGE: MIXED
Body of every message is in English.
Use the local greeting and local sign-off only.
Email greeting: ${g.email}
WhatsApp and LinkedIn greeting: ${g.social}
Sign-off: "${s}"
Everything between greeting and sign-off must be in English.
No other local words anywhere in the body.`;
}

function getChannelPlaybook(country) {
  const books = {
    indonesia: {
      email: `PAIN: Indirect. "Teams like yours often deal with..." Never blunt.
PRODUCT: Only after warmth is set. Frame as something that might help, not a pitch.
CTA: Soft. Never ask for a meeting directly.`,
      linkedin: `No product mention. Genuine observation about their work or company. Ask to connect. MAX 280 chars.`,
      whatsapp: `Intro line, one real observation, one open question. No pitch. No call ask. 3 lines only.`,
    },
    singapore: {
      email: `OPENER: Lead with a business fact or pain that makes them think "how do they know that?"
PAIN: Direct. "Most [role] teams lose X on Y."
PROOF: One number or logo. Nothing more.
CTA: Direct. "Worth 15 minutes?" works fine.`,
      linkedin: `Sharp observation about their role or company. One line on what you do. Ask to connect. MAX 280 chars.`,
      whatsapp: `One line on who you are. One value point. One direct ask. 2 to 3 sentences.`,
    },
    malaysia: {
      email: `OPENER: Warm but brief note about their role or company.
CULTURAL: Do not assume ethnicity or religion.`,
      linkedin: `Genuine observation. Why it fits them. Warm invite. No pitch. MAX 280 chars.`,
      whatsapp: `Warm opener. One point. One question. 2 to 3 sentences.`,
    },
    philippines: {
      email: `TONE: Warm and genuine. Use "we" and "together" framing where natural.
PAIN: "A lot of [role] teams we work with deal with..." — shared challenge framing.`,
      linkedin: `Specific genuine point about their role or company. No pitch. MAX 280 chars.`,
      whatsapp: `Warm opener. Real observation. Friendly question. 3 lines max.`,
    },
    vietnam: {
      email: `CREDIBILITY FIRST: Name a notable customer or result in sentence 2.
TONE: Formal and respectful. Seniority aware.
PAIN: Framed as an industry trend, not their personal issue.
CTA: "I would be glad to share more at a time that works for you."`,
      linkedin: `Lead with your company track record. Formal tone. MAX 280 chars.`,
      whatsapp: `Formal opener. One credibility line. One polite question. 3 lines.`,
    },
    thailand: {
      email: `TONE: Warm and positive. Never imply they have a problem. No urgency.
PAIN: Reframe as an open door. "Many teams in Thailand are finding new ways to..."
CTA: "If this is useful, happy to share more."`,
      linkedin: `Positive observation. Gentle invite. No pressure at all. MAX 280 chars.`,
      whatsapp: `Positive opener. One real observation. Easy question. 3 lines.`,
    },
    general: {
      email: `Pain-led opener. Value. CTA. Clear and direct.`,
      linkedin: `One point. One question. No pitch. MAX 280 chars.`,
      whatsapp: `2 to 3 sentences. One point. One question.`,
    },
  };
  return books[country] || books["general"];
}

function buildPrompt(prospect, country, userProfile, companyNews, theme, lang) {
  const newsBlock = companyNews
    ? `Recent intel on ${prospect.company || "their company"}: "${companyNews}" — weave in naturally only if it fits.`
    : "";
  const credBlock = [
    userProfile.logos      && `Notable customers: ${userProfile.logos}`,
    userProfile.creds      && `Credentials: ${userProfile.creds}`,
    userProfile.background && `Sender background: ${userProfile.background}`,
  ].filter(Boolean).join("\n") || "No proof points — do not fabricate any.";
  const firstName = (prospect.name||"").split(" ")[0] || "there";
  const langRule  = getLangModifier(lang, country);
  const themeRule = getThemeModifier(theme);

  return `You are a top-performing local SaaS sales and business development rep with deep knowledge of Southeast Asian business culture. You write short, human, personalized outbound messages — not templates, not pitches. Your goal is to start a low-pressure conversation, not close a deal. The recipient should feel respected, not sold to.

SENDER
Name: ${userProfile.name}
Title: ${userProfile.title}
Company: ${userProfile.company}
What they sell: ${userProfile.product}
Best result delivered: ${userProfile.outcome || "not stated"}
${credBlock}

PROSPECT
Name: ${prospect.name || "the prospect"}
First name: ${firstName}
Role: ${prospect.headline || "unknown"}
Company: ${prospect.company || "their company"}
Country: ${country.toUpperCase()}
Location: ${prospect.location || country}
${newsBlock}

---
SENIORITY RULES
C-level or Founder: be concise, respect their time, focus on strategic relevance, avoid long explanations, sound like a professional peer.
Director or VP: balance strategic and operational value, keep structure clean and credible.
Manager or Lead: be slightly more detailed, emphasize practical or team-level benefits.
Infer seniority from their role title.

---
SOUTHEAST ASIA META RULES
Avoid aggressive or pushy tone. Prioritize trust. Maintain politeness and cultural sensitivity. Sound human and conversational. Focus on relationship before transaction. No hard selling.

---
COUNTRY RULES — apply the rules for ${country.toUpperCase()}
Singapore: concise and efficient, prioritize clarity, avoid excessive small talk, direct but polite CTA.
Indonesia: relationship-first, warm and respectful, indirect soft CTA, show humility, respect hierarchy.
Malaysia: moderately formal, balanced warmth and professionalism, soft persuasion, avoid slang.
Vietnam: professional and respectful, emphasize credibility, structured and clear, indirect CTA, long-term value focus.
Thailand: friendly and positive, avoid pressure, indirect suggestions, prioritize harmony, gentle CTA.
Philippines: warm and conversational, slightly more expressive, approachable but professional, encourage dialogue.
Cambodia: formal and respectful, avoid casual slang, polite and structured.
Myanmar: gentle and reserved, avoid assertiveness, courteous phrasing.
Laos: warm and patient, indirect suggestions, relationship-oriented.
Brunei: formal and respectful, culturally sensitive, no aggressive selling.
General: warm, professional, human.

---
OPENING STRUCTURE BY COUNTRY
Singapore, Vietnam: lead with relevance or a specific observation about their role or company.
Indonesia, Thailand, Laos: lead with appreciation or a warm contextual acknowledgment.
Philippines: lead with a friendly conversational opener.
Malaysia, Cambodia, Myanmar, Brunei: lead with a polite professional observation.

---
TONE
${themeRule}

---
LANGUAGE
${langRule}

---
NON-NEGOTIABLES
1. Address the prospect by their first name (${firstName}) in the greeting of every message.
2. Reference their company (${prospect.company || "their company"}) at least once.
3. End every message with a CTA.

---
CTA RULES
The CTA is two parts:
Part 1 — setup sentence (one plain sentence that earns the ask naturally):
Options: "Happy to share more if useful." / "Can send over more context if it fits." / "Easy to show how it works for ${prospect.company || "your team"}." / "Worth exploring if it applies to what you are working on."
Part 2 — closing question on its own line (under 5 words, vary each generate, never repeat the same one twice):
"Keen on a look?" / "Worth a look?" / "Open to a peek?" / "Keen to see more?" / "Worth finding out?" / "Up for a look?" / "Want to see it?" / "Worth a quick look?" / "Open to hearing more?" / "Good time to look?" / "Keen on more?" / "Makes sense to look?"

---
EMAIL FORMAT — follow this structure exactly
Greeting line with first name:
  English only: "Hi ${firstName},"
  Mixed Indonesia: "Pak ${firstName}," or "Ibu ${firstName},"
  Mixed Vietnam: "Kính gửi Anh/Chị ${firstName},"
  Mixed Thailand: "Sawasdee krub/kha, Khun ${firstName},"
  Mixed Philippines or Malaysia or Singapore: "Hi ${firstName},"
  Full local: appropriate local greeting with their name.

[blank line]
[Opening sentence — pain, observation, or acknowledgment per country rules. Varies in structure each generate.]
[One sentence that earns the relevance — why this matters at their level and company.]
[Value hint — connect the problem to what you offer. Do not pitch. 1 to 2 sentences.]
[Optional proof — one number or customer name only. Skip if nothing strong.]
[CTA Part 1 — setup sentence]
[CTA Part 2 — closing question on its own line]

[Sign-off per language setting],
${userProfile.name}
${userProfile.title} | ${userProfile.company}

EMAIL SUBJECT: 3 words max. Pain or role specific. No hype words. No questions.
EMAIL BODY: under 85 words. Count carefully. Body only, not subject or sign-off.

---
WRITING RULES — apply to all three messages
Use short plain words. Under 3 syllables where possible.
No hyphens anywhere. Write "follow up" not "follow-up".
No exclamation marks.
No buzzwords: no implementation, collaboration, optimisation, transformation, streamline, leverage, utilise, facilitate, comprehensive, innovative, revolutionise, synergy, solutions, game changer.
Do not use a clean 3-paragraph format. Allow slight conversational looseness.
Vary sentence length naturally.
Write like a thoughtful human typing quickly on a weekday, not a copywriter polishing a template.
Include at least one concrete observation about their role or company and tie it to the pain.
Do not repeat phrasing patterns between email, LinkedIn, and WhatsApp in the same generate.

---
BANNED PHRASES — all three messages
"I hope this finds you well" / "My name is" / "I came across your profile" / "I wanted to reach out" / "Touch base" / "circle back" / "Book a demo" / "Schedule a call" / "set up a meeting" / any opener that praises them such as "impressive", "your journey", "I admire", "love what you are doing"

---
VARY STRUCTURE EACH GENERATE
Each generate must use a different opening angle and sentence structure from previous ones.
Rotate between: a specific fact, a direct pain statement, an observation about their company, a role-specific question.
Never start two generates with the same word or sentence type.

---
OUTPUT FORMAT — no commentary, exact headers only

===EMAIL===
Subject: [3 words max]

[email body, under 85 words]

${userProfile.name}
${userProfile.title} | ${userProfile.company}

===LINKEDIN===
[message — max 280 characters]

===WHATSAPP===
[message — 3 sentences max]`;}


async function parseProfileWithAI(apiKey, pageText, expText, selectorData) {
  try {
    const expBlock = expText
      ? `EXPERIENCE SECTION TEXT (most accurate for job title):\n${expText.slice(0, 1500)}`
      : "EXPERIENCE SECTION TEXT: not available";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content:
`Parse this LinkedIn profile. Extract the fields below.

TOP CARD TEXT:
${pageText.slice(0, 2000)}

${expBlock}

SELECTOR HINTS (may be inaccurate):
name: "${selectorData.name||""}"
headline (subtext under name, often not the real title): "${selectorData.rawHeadline||""}"
experience title (from selector, use as strong hint): "${selectorData.experienceTitle||""}"
location: "${selectorData.location||""}"
company: "${selectorData.company||""}"

INSTRUCTIONS:
- For the title field: prefer the experience section title over the headline subtext. The headline is often a tagline or personal brand statement, not a job title. The experience section shows the actual current role.
- If the experience section title is available and looks like a real job title, use it.
- name: full name only
- company: current employer
- location: city and/or country
- confidence: high if name+title+company all clear, medium if some ambiguity, low if guessing

Return ONLY valid JSON, no markdown:
{"name":"full name","title":"job title only","company":"current employer","location":"city or country","confidence":"high|medium|low"}

Never fabricate. Empty string if genuinely not found.` }],
        temperature: 0.1, max_tokens: 200,
      }),
    });
    if (!res.ok) return null;
    return JSON.parse((await res.json()).choices[0].message.content.replace(/```json|```/g,"").trim());
  } catch { return null; }
}

async function fetchCompanyContext(apiKey, companyName) {
  if (!companyName || companyName.length < 2) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content:
`Recent news about "${companyName}" from the last 6 months. Funding, product launches, growth, key hires.
If found: one sentence with a specific number or date.
If nothing concrete found: reply NOTHING_FOUND. Do not fabricate anything.` }],
        temperature: 0.2, max_tokens: 100,
      }),
    });
    if (!res.ok) return null;
    const t = (await res.json()).choices[0].message.content.trim();
    return t.includes("NOTHING_FOUND") ? null : t;
  } catch { return null; }
}

async function callOpenAI(apiKey, prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.9, max_tokens: 1200 }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || "OpenAI error"); }
  return (await res.json()).choices[0].message.content;
}

function parseResponse(raw) {
  return {
    email:    raw.match(/===EMAIL===([\s\S]*?)(?====LINKEDIN===|$)/)?.[1]?.trim() || "",
    linkedin: raw.match(/===LINKEDIN===([\s\S]*?)(?====WHATSAPP===|$)/)?.[1]?.trim() || "",
    whatsapp: raw.match(/===WHATSAPP===([\s\S]*?)$/)?.[1]?.trim() || "",
  };
}

function countEmailWords(emailText) {
  const withoutSubject = emailText.replace(/^Subject:.*\n/m, "");
  const withoutSignoff = withoutSubject.replace(/\n\n[^\n]+\n[^\n]+\|[^\n]+$/m, "");
  return withoutSignoff.trim().split(/\s+/).filter(Boolean).length;
}

const $ = id => document.getElementById(id);
function showScreen(id) { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); $(`screen-${id}`).classList.add("active"); }
function showError(msg) { $("errorMsg").textContent = msg; $("errorMsg").classList.add("visible"); }
function hideError() { $("errorMsg").classList.remove("visible"); }
function setStatus(msg) { $("generateBtn").textContent = msg || "✦ Generate Messages"; $("generateBtn").disabled = !!msg; $("loadingBar").classList.toggle("visible", !!msg); }
function switchTab(tab) { document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab)); ["email","linkedin","whatsapp"].forEach(t => $(`out-${t}`).classList.toggle("visible", t === tab)); }
function showOutput(messages) {
  $("msg-email").textContent    = messages.email;
  $("msg-linkedin").textContent = messages.linkedin;
  $("msg-whatsapp").textContent = messages.whatsapp;
  const wc = countEmailWords(messages.email);
  $("meta-email").textContent   = `${wc} words`;
  $("outputArea").style.display = "block";
  switchTab("email");
}
function showOverride() { $("overridePanel").classList.add("visible"); }
function hideOverride() { $("overridePanel").classList.remove("visible"); }
function getOverrideData() { return { name: $("ov-name").value.trim(), headline: $("ov-title").value.trim(), company: $("ov-company").value.trim(), location: $("ov-country").value.trim() }; }
function mergeProspect(scraped, override) { return { name: override.name||scraped.name||"", headline: override.headline||scraped.headline||"", rawHeadline: scraped.rawHeadline||"", company: override.company||scraped.company||"", location: override.location||scraped.location||"" }; }
function prefillOverride(p) { $("ov-name").value=p.name||""; $("ov-title").value=p.headline||""; $("ov-company").value=p.company||""; $("ov-country").value=p.location||""; }

function bindChipGroup(containerSelector, stateKey) {
  const el = document.querySelector(containerSelector);
  if (!el) return;
  el.addEventListener("click", e => {
    const chip = e.target.closest(".ctrl-chip"); if (!chip) return;
    el.querySelectorAll(".ctrl-chip").forEach(c => c.classList.remove("selected"));
    chip.classList.add("selected");
    state[stateKey] = chip.dataset.val;
  });
}

let onboardingReady = false;
function setupOnboarding() {
  if (onboardingReady) return;
  onboardingReady = true;

  function updateDots(step) {
    for (let i = 0; i < 3; i++) {
      const d = $(`dot-${i}`); if (!d) continue;
      d.className = "step-dot" + (i < step ? " done" : i === step ? " active" : "");
    }
  }
  function goToStep(n) { document.querySelectorAll(".step").forEach(s => s.classList.remove("active")); $(`step-${n}`)?.classList.add("active"); updateDots(n); }
  function validate(n) {
    const fail = id => { $(id).classList.add("visible"); return false; };
    const pass = id => { $(id)?.classList.remove("visible"); return true; };
    if (n===0 && (!$("ob-name").value.trim()||!$("ob-title").value.trim()||!$("ob-company").value.trim())) return fail("val-0");
    if (n===0) return pass("val-0");
    if (n===1 && !$("ob-product").value.trim()) return fail("val-1");
    if (n===1) return pass("val-1");
    if (n===2 && !$("ob-apikey").value.trim()) return fail("val-2");
    if (n===2) return pass("val-2");
    return true;
  }

  $("screen-onboarding").addEventListener("click", e => {
    const btn = e.target.closest("button"); if (!btn) return;
    const id = btn.id;
    if (id==="next-0" && validate(0)) goToStep(1);
    else if (id==="next-1" && validate(1)) goToStep(2);
    else if (id==="back-1") goToStep(0);
    else if (id==="back-2") goToStep(1);
    else if (id==="next-2") {
      if (!validate(2)) return;
      const profile = {
        name:$("ob-name").value.trim(), title:$("ob-title").value.trim(),
        company:$("ob-company").value.trim(), product:$("ob-product").value.trim(),
        outcome:$("ob-outcome").value.trim(), logos:$("ob-logos").value.trim(),
        creds:$("ob-creds").value.trim(), background:$("ob-background").value.trim(),
        apiKey:$("ob-apikey").value.trim(),
      };
      saveProfile(profile); launchApp(profile);
    }
  });

  window._fillOnboarding = function(p) {
    if (!p) return;
    ["name","title","company","product","outcome","logos","creds","background"].forEach(k => $(`ob-${k}`).value=p[k]||"");
    $("ob-apikey").value=p.apiKey||"";
    goToStep(0);
  };
}

let appReady = false;
let scrapedProspect = {};
let currentUserProfile = null;

function launchApp(userProfile) {
  currentUserProfile = userProfile;
  $("userPill").textContent = `${userProfile.name} · ${userProfile.company}`;
  $("outputArea").style.display = "none";
  $("researchBadge").style.display = "none";
  hideOverride(); hideError();
  showScreen("app");
  scrapeCurrentTab();

  if (appReady) return;
  appReady = true;

  $("closeBtn").addEventListener("click", () => window.close());
  $("editBtn").addEventListener("click", () => { window._fillOnboarding?.(currentUserProfile); showScreen("onboarding"); });

  bindChipGroup('[data-group="theme"]', "theme");
  bindChipGroup('[data-group="lang"]', "lang");

  $("outputArea").addEventListener("click", e => { const btn = e.target.closest(".tab-btn"); if (btn) switchTab(btn.dataset.tab); });

  document.addEventListener("click", e => {
    const btn = e.target.closest(".copy-btn"); if (!btn) return;
    const el = $(btn.dataset.target); if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
      btn.textContent = "✓ Copied!"; btn.classList.add("copied");
      setTimeout(() => { btn.textContent = btn.dataset.target.includes("email") ? "Copy Email" : "Copy Message"; btn.classList.remove("copied"); }, 2000);
    });
  });

  $("overrideToggleBtn").addEventListener("click", () => $("overridePanel").classList.toggle("visible"));
  $("overrideClose").addEventListener("click", hideOverride);
  $("scrapeWarnFix").addEventListener("click", () => { showOverride(); $("scrapeWarn").classList.remove("visible"); });
  $("manualEntryBtn").addEventListener("click", () => { $("stateIdle").style.display="none"; $("profileCard").classList.remove("visible"); showOverride(); });

  async function generate() {
    hideError(); $("researchBadge").style.display = "none";
    if (!currentUserProfile?.apiKey?.startsWith("sk-")) { showError("API key looks invalid. Click Edit Profile."); return; }
    const prospect = mergeProspect(scrapedProspect, getOverrideData());
    if (!prospect.name && !prospect.company) { showOverride(); showError("Enter at least a name or company."); return; }
    const country = detectCountry(prospect.location||"");
    setStatus("🔍 Researching company…");
    const news = await fetchCompanyContext(currentUserProfile.apiKey, prospect.company);
    if (news) { $("researchBadge").textContent=`📰 ${news.slice(0,120)}${news.length>120?"…":""}`; $("researchBadge").style.display="block"; }
    setStatus("✦ Writing messages…");
    try {
      showOutput(parseResponse(await callOpenAI(currentUserProfile.apiKey, buildPrompt(prospect, country, currentUserProfile, news, state.theme, state.lang))));
    } catch(err) { showError("Error: "+err.message); }
    finally { setStatus(null); }
  }

  $("generateBtn").addEventListener("click", generate);
  $("regenBtn").addEventListener("click", generate);

  chrome.tabs.onActivated.addListener(() => { scrapedProspect={}; $("outputArea").style.display="none"; $("researchBadge").style.display="none"; hideError(); hideOverride(); scrapeCurrentTab(); });
}

async function scrapeCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isLinkedIn = tab?.url?.includes("linkedin.com/in/");

  if (!isLinkedIn) { $("stateIdle").style.display="block"; $("profileCard").classList.remove("visible"); $("scrapeWarn").classList.remove("visible"); return; }

  $("stateIdle").style.display="none"; $("profileCard").classList.add("visible");
  $("profileName").textContent="Reading profile…";
  $("profileMeta").innerHTML=`<span style="color:#6b6b80;font-size:11px">Parsing page…</span>`;

  try { await chrome.scripting.executeScript({ target:{tabId:tab.id}, files:["content.js"] }); } catch {}

  let rawScrape = {};
  try { rawScrape = await chrome.tabs.sendMessage(tab.id, { action:"scrape" }); } catch {}

  let sel={}, pageText="", expText="";
  if (rawScrape?.selectorData) { sel=rawScrape.selectorData; pageText=rawScrape.pageText||""; expText=rawScrape.expText||""; }
  else if (rawScrape?.name) { sel={ name:rawScrape.name, rawHeadline:rawScrape.rawHeadline||rawScrape.headline||"", experienceTitle:"", location:rawScrape.location, company:rawScrape.company }; }

  let aiParsed=null;
  if (pageText && currentUserProfile?.apiKey?.startsWith("sk-")) aiParsed = await parseProfileWithAI(currentUserProfile.apiKey, pageText, expText, sel);

  scrapedProspect = {
    name:        (aiParsed?.name     || sel.name     || "").trim(),
    headline:    (aiParsed?.title    || sel.rawHeadline || "").trim(),
    rawHeadline: (sel.rawHeadline || "").trim(),
    company:     (aiParsed?.company  || sel.company  || "").trim(),
    location:    (aiParsed?.location || sel.location || "").trim(),
    confidence:  aiParsed?.confidence || (sel.name ? "medium" : "low"),
  };

  if (scrapedProspect.name) {
    const country=detectCountry(scrapedProspect.location||"");
    const conf=scrapedProspect.confidence||"medium";
    const cc={high:"#4ade80",medium:"#fbbf24",low:"#ff6b6b"}[conf];
    const cl={high:"✦ High confidence",medium:"~ Medium confidence",low:"⚠ Low — click Edit to verify"}[conf];
    $("scrapeWarn").classList.remove("visible");
    $("profileName").textContent=scrapedProspect.name;
    $("profileMeta").innerHTML=`
      <div>${FLAGS[country]||"🌏"} ${scrapedProspect.location||"Unknown"} &nbsp;💼 ${scrapedProspect.headline||"—"} &nbsp;🏢 ${scrapedProspect.company||"—"}</div>
      <div style="margin-top:4px"><span style="color:${cc};font-size:10px;font-weight:600">${cl}</span><span style="color:#6b6b80;font-size:10px;margin-left:8px">${aiParsed?"· AI-parsed":"· CSS selector"}</span></div>`;
    prefillOverride(scrapedProspect);
    if (conf==="low") showOverride();
  } else { $("profileCard").classList.remove("visible"); $("scrapeWarn").classList.add("visible"); showOverride(); }
}

document.addEventListener("DOMContentLoaded", () => {
  setupOnboarding();
  const saved = loadProfile();
  if (saved?.apiKey) launchApp(saved);
  else showScreen("onboarding");
});
