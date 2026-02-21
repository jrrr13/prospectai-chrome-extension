# ProspectAI

A Chrome extension that generates culturally-adapted B2B outreach messages for Southeast Asian prospects — directly from their LinkedIn profile.

Built to solve a real problem: generic cold emails don't work in SEA. Business culture varies significantly across the region, and messages that land in Singapore often fall flat in Indonesia or Vietnam. This tool adapts tone, language, and structure to the prospect's country automatically.

---

## What it does

1. Open a LinkedIn profile in Chrome
2. Click the ProspectAI side panel
3. It reads the prospect's name, role, company, and location
4. Looks up recent company news via AI
5. Generates three tailored messages — email, LinkedIn DM, and WhatsApp — adapted to the prospect's country and seniority level

---

## Features

- **11 SEA markets supported** — Singapore, Indonesia, Malaysia, Philippines, Vietnam, Thailand, Myanmar, Cambodia, Laos, Brunei, Timor-Leste
- **Seniority-aware messaging** — C-suite gets peer-level brevity, managers get more detail
- **Three tone modes** — Sharp, Warm, Curious
- **Three language modes** — English only, Mixed (local greeting + sign-off), Full local
- **AI-powered profile parsing** — uses GPT-4o-mini to extract job title from the Experience section, not just the headline tagline
- **Company intelligence** — fetches recent funding, launches, or news to personalize the opener
- **Persistent side panel** — stays open across tab switches, built for BDR workflows
- **Regenerate** — produces a structurally different message each time, rotating openers and CTA phrasing

---

## Tech stack

- Chrome Extension Manifest V3
- Vanilla JavaScript
- OpenAI API (GPT-4o-mini)
- Chrome Side Panel API
- Chrome Scripting API

---

## How to install (local)

This extension is not on the Chrome Web Store. Install it manually:

1. Download or clone this repository
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the folder containing these files

You will need an OpenAI API key. Get one at [platform.openai.com](https://platform.openai.com). Typical usage costs around $1–2 per month for active BDR prospecting.

---

## Setup

On first launch, a 3-step onboarding flow collects:
- Your name, title, and company
- What you sell and your best result delivered
- Optional credibility signals (notable customers, funding, your background)
- Your OpenAI API key

Everything is saved locally in your browser. Nothing is sent to any server other than OpenAI's API.

---

## Why I built this

I kept seeing the same problem in SEA sales: outreach written for a Western audience, sent to someone in Jakarta or Ho Chi Minh City, and ignored. The region has distinct norms around hierarchy, relationship-building, and directness that vary country to country.

I wanted a tool that actually understood those differences — not just translated words, but adapted structure, tone, and cultural cues. So I built one.

---

## Limitations

- Requires manual installation (not on Chrome Web Store)
- LinkedIn scraping may break if LinkedIn changes their page layout — the AI parser is designed to be resilient to this, but not guaranteed
- Company news lookup relies on GPT-4o-mini's training data, not live web search
- Best results when the LinkedIn profile is in English

---

## Author

Built by [JR Tan] — BDR with a focus on Southeast Asian markets.

[LinkedIn](https://www.linkedin.com/in/junren-tan/) · [Email](mailto:tanjrrr@gmail.com)
