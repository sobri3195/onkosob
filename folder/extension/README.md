# Lentera Onko Vision Companion

Privacy-first Manifest V3 companion for saving educational pages, quotations, terms, and doctor questions. It is not a diagnostic or treatment tool.

## Development

```bash
cd folder/extension
npm install
npm run dev
npm run typecheck
```

## Build

Run `npm run build`. The prebuild step generates the required PNG icon sizes from the repository's text-based SVG mark, so binary build assets do not need to be committed. Loadable output is written to `folder/extension/dist` with stable background and content-script filenames.

## Install in Chrome / Edge

1. Open Chrome Extensions (`chrome://extensions`) or Edge Extensions (`edge://extensions`).
2. Enable Developer Mode.
3. Click Load unpacked.
4. Select `folder/extension/dist`.

Brave and Opera use their equivalent Chromium extension pages.

## Extension icons

`public/icons/lantern-mark.svg` is the reviewable source mark. `npm run icons` generates the required 16, 32, 48, and 128 pixel PNG files locally; these generated binaries and `dist/` are intentionally ignored by Git.

## Permissions

- `storage`: keeps versioned Lentera data and preferences locally.
- `contextMenus`: provides explicit page, quotation, and question actions.
- `activeTab`: accesses only the active page following an extension action.
- `scripting`: retrieves an explicit selection and installs the isolated toolbar after the popup is opened.

There are no host permissions or `<all_urls>` access. The active-tab approach means the toolbar becomes available after the user invokes Lentera on a page. Restricted URLs are rejected.

## Privacy

The extension does not collect browser history, cookies, searches, health information, or page bodies; contains no analytics, remote scripts, AI, or automatic sync; and never scans every visited page. Explicitly saved data stays in `chrome.storage.local` under `lentera_extension_v1`. JSON export contains only extension collections and preferences. The patient bridge only opens validated Lentera deep links and does not access cross-origin website storage.

Selections are limited to 5,000 characters. Imported JSON is structurally validated and unsafe base URLs are rejected. Clinical glossary information is educational and does not replace medical consultation.
