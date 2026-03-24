---
name: playwright-scraper
description: High-performance Playwright-based web scraper with stealth mode to bypass bot detection, supporting dynamic JS content and customizable viewport and User-Agent.
tags:
  - Browser
  - Scraping
---
# Playwright Stealth Scraper

A high-performance MCP skill for OpenClaw that bypasses anti-bot measures using Playwright Extra and Stealth plugin.

## Features
- **Stealth Mode**: Uses `puppeteer-extra-plugin-stealth` to mimic real browser behavior.
- **Dynamic Content**: Full JavaScript execution support for SPA and React-based sites.
- **Flexible Options**: Custom viewport and User-Agent spoofing.

## Tools
### stealth_scrape
Scrapes any URL with advanced bot detection bypass.
- `url`: The target website address.

## Installation
Requires Playwright and Chromium to be installed in the skill directory.