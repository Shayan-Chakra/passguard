# PassGuard

**A privacy-first Chrome extension that checks how risky your password is, explains why, and helps you replace it. Everything runs on your device.**

**[Try the live demo](https://Shayan-Chakra.github.io/passguard/)** (no install needed)

![PassGuard popup](Screenshots/Screenshot2.png,Screenshots/Screenshot1.png)

<!-- Add a short GIF here once you record one, for example: ![Demo](screenshots/demo.gif) -->

## Why I built this

Most password meters give you a color bar and nothing else. They don't say *what* is wrong, and many ask you to trust a server with your password. PassGuard explains each weakness in plain language and never sends your password anywhere.

## Features

- **Real-time risk score (0-100)** with four levels: Low, Moderate, High, Critical
- **Explains the "why"**: short length, few character types, repeated characters, years, keyboard patterns, common passwords
- **Context-aware check**: flags passwords that contain the website's name (for example `Amazon@2026` on amazon.com)
- **Works on login pages**: detects password fields, including ones that load later, and shows a warning badge below the field
- **Secure password generator**: uses the Web Crypto API (`crypto.getRandomValues`) with rejection sampling to avoid bias, not `Math.random()`
- **One-click fill**: generate a strong password and fill it into the field
- **Popup tester and generator** with adjustable length and character sets

## Privacy

- Passwords are analyzed **locally** in your browser.
- Passwords are **never stored, logged or transmitted**.
- The extension requests only the `storage` permission and makes no network requests.

## How it works

```
Web page ──> Content script ──> Risk engine (zxcvbn + custom rules) ──> Score + reasons ──> Warning badge
                                                                                      └──> Password generator
```

| File | Job |
|---|---|
| `manifest.json` | Declares the extension (Manifest V3) and which scripts to inject |
| `content.js` | Finds password fields and shows the warning badge |
| `riskEngine.js` | Combines zxcvbn with custom rules to produce a score and reasons |
| `generator.js` | Creates secure random passwords |
| `popup.html` / `popup.js` | The toolbar popup: password tester and generator |
| `content.css` | Styles for the in-page badge |
| `lib/zxcvbn.js` | Password-strength library by Dropbox |
| `docs/` | The live demo page (GitHub Pages) |

## Install the extension

1. Download `passguard-extension.zip` from the [Releases](../../releases) page and unzip it.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder (the one that contains `manifest.json`).
5. Open any login page and type in the password box.

Want to test safely? Open `test.html` from this repo (turn on **Allow access to file URLs** for the extension first).

## Tech stack

JavaScript, HTML, CSS, Chrome Extension Manifest V3, Web Crypto API, [zxcvbn](https://github.com/dropbox/zxcvbn)

## Roadmap

- [x] Password field detection
- [x] Risk engine with explanations
- [x] Context-aware checks
- [x] Secure password generator
- [x] Popup UI and web demo
- [ ] Breach check using the k-anonymity range API (only a 5-character hash prefix is sent)
- [ ] Passphrase generator
- [ ] Settings page
- [ ] Password reuse detection using salted hashes
- [ ] Evaluation: accuracy, false positives, speed

## Limitations

The risk score is an estimate built from zxcvbn plus simple rules. It is not a guarantee that a password is safe or unsafe. Use a password manager and two-factor authentication for important accounts.

## License

MIT. See [LICENSE](LICENSE).
