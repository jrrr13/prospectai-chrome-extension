// content.js — ProspectAI v15
//
// Scraping strategy:
// 1. Extract visible text from the top card (name, headline, location)
// 2. Also extract visible text from the Experience section (most accurate job title)
// 3. Send both to the side panel — AI parses and merges with selector hints

function extractTopCardText() {
  const containers = [
    "main .ph5.pb5",
    ".pv-top-card",
    "[data-view-name='profile-card']",
    "main section:first-of-type",
    "main",
  ];
  for (const sel of containers) {
    const el = document.querySelector(sel);
    if (el) {
      const lines = el.innerText.split("\n").map(l => l.trim()).filter(l => l.length > 0).slice(0, 60);
      if (lines.length > 3) return lines.join("\n");
    }
  }
  return document.body.innerText.split("\n").map(l => l.trim()).filter(l => l.length > 0).slice(0, 60).join("\n");
}

function extractExperienceText() {
  // Try multiple ways to find the experience section
  const expSelectors = [
    "#experience",
    "[data-view-name='profile-component-entity'][id*='experience']",
    "section[data-section='experience']",
  ];

  for (const sel of expSelectors) {
    const anchor = document.querySelector(sel);
    if (anchor) {
      // Walk up to find the section container, then get its text
      let container = anchor;
      for (let i = 0; i < 4; i++) {
        if (container.parentElement) container = container.parentElement;
        const text = container.innerText?.trim();
        if (text && text.length > 50) {
          const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0).slice(0, 40);
          return lines.join("\n");
        }
      }
    }
  }

  // Fallback: look for any section whose heading contains "Experience"
  const headings = document.querySelectorAll("h2, h3, span[aria-hidden='true']");
  for (const h of headings) {
    if (h.innerText?.trim().toLowerCase() === "experience") {
      let container = h;
      for (let i = 0; i < 5; i++) {
        if (container.parentElement) container = container.parentElement;
        const text = container.innerText?.trim();
        if (text && text.length > 100) {
          const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0).slice(0, 40);
          return lines.join("\n");
        }
      }
    }
  }

  return "";
}

function selectorScrape() {
  const get = (...sels) => {
    for (const s of sels) {
      const el = document.querySelector(s);
      if (el?.innerText?.trim()) return el.innerText.trim();
    }
    return "";
  };

  const name = get("h1.text-heading-xlarge", ".pv-text-details__left-panel h1", "h1");
  const rawHeadline = get(
    ".text-body-medium.break-words",
    ".pv-text-details__left-panel .text-body-medium"
  );
  const location = get(
    ".text-body-small.inline.t-black--light.break-words",
    ".pv-text-details__left-panel span.text-body-small"
  );

  // Try to get current job title from Experience section (more accurate than headline)
  let experienceTitle = "";
  let company = "";

  // Approach: get all experience list items and read the first one
  const expItems = document.querySelectorAll(
    "#experience ~ div li, #experience + div li, .pvs-list__item--line-separated"
  );
  if (expItems.length > 0) {
    const firstItem = expItems[0];
    const spans = firstItem.querySelectorAll("span[aria-hidden='true']");
    const texts = Array.from(spans).map(s => s.innerText.trim()).filter(t => t.length > 0);
    // First non-empty span is usually the title, second is company
    if (texts.length >= 1) experienceTitle = texts[0];
    if (texts.length >= 2) company = texts[1].split("·")[0].trim();
  }

  // Fallback company sources
  if (!company) {
    const badge = document.querySelector(".pv-text-details__right-panel-item-text");
    if (badge) company = badge.innerText.trim();
  }
  if (!company && rawHeadline.includes("@")) {
    const m = rawHeadline.match(/@\s*([A-Za-z0-9\s&.,'-]+)/);
    if (m) company = m[1].trim();
  }

  return { name, rawHeadline, experienceTitle, location, company };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const selectorData = selectorScrape();
    const topCardText  = extractTopCardText();
    const expText      = extractExperienceText();

    sendResponse({
      selectorData,
      pageText:    topCardText,
      expText:     expText,
    });
  }
});
