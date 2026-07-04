# [codex] Add AI Assistant Home page with SegmentControl, BottomCard, ChatInput and BottomToolbar

## Overview

Implements a new **AI Assistant Home** page according to the UI Reverse Engineering Spec v1.0. The page replaces the existing dashboard as the post-login landing page (`/home`).

## What changed

- **Design Tokens** (`src/styles/_ai-tokens.scss`) ！ Spec-driven SCSS variables for colors, typography, border-radius, shadows, spacing, and layout dimensions
- **AiHomePage.vue** ！ Root page component that assembles TopBar, MainContent, and BottomCard
- **TopBar.vue** ！ 64dp header bar with BackButton (40dp circle, left-aligned) and SegmentControl (centered)
- **SegmentControl.vue** ！ Pill-shaped "Work | Code" tab switcher with animated slider
- **MainContent.vue** ！ Empty flex:1 space (「48% of viewport) per spec requirement for breathing room
- **BottomCard.vue** ！ Floating card (radius 32dp, white bg, soft shadow) containing InputArea + Actions + Toolbar
- **ChatInput.vue** ！ Textarea input (#F7F7F7 bg, radius 24dp) with sparkle icon and send button
- **ActionButtons.vue** ！ Three model-select pills (DeepSeek, Claude, ChatGPT)
- **BottomToolbar.vue** ！ Mode-aware 6-icon toolbar (Work: Web Search, Image Gen, Files, Code, History, Settings; Code: GitHub, Debug, Terminal, Review, Deploy, Docs)
- **Router update** ！ `/home` now loads AiHomePage.vue instead of the old dashboard

## Design notes

- Pure Vue3 + Composition API + `<script setup lang="ts">` + SCSS (BEM methodology)
- Zero third-party UI framework usage on the new page
- All colors, radii, shadows, and spacing sourced from Design Tokens ！ no magic numbers
- 8pt Grid system throughout
- Pixel-perfect implementation with ＋2px tolerance
- TypeScript type-check passes cleanly

## How to test

1. `npm run dev`
2. Log in via `/login` with valid credentials
3. You are redirected to `/home` showing the new AI Assistant page
4. Toggle "Work" / "Code" tabs to verify segment animation and toolbar item swapping
5. Type in the input area and verify the send button activates/deactivates correctly
