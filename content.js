console.log("PassGuard content script loaded");
const badge = document.createElement("div");
badge.id = "passguard-badge";
badge.style.display = "none";
document.body.appendChild(badge);

function showBadge(input, result) {
  const rect = input.getBoundingClientRect();
  badge.style.left = rect.left + window.scrollX + "px";
  badge.style.top = rect.bottom + window.scrollY + 4 + "px";
  badge.className = "pg-" + result.level.toLowerCase();
  badge.replaceChildren();

  const title = document.createElement("strong");
  title.textContent = `Risk: ${result.level} (${result.score}/100)`;
  badge.appendChild(title);

  result.reasons.forEach(r => {
    const p = document.createElement("div");
    p.textContent = "• " + r;
    badge.appendChild(p);
  });

  const btn = document.createElement("button");
  btn.textContent = "Generate strong password";
  btn.type = "button";
  btn.onclick = () => fillField(input, generatePassword(16));
  badge.appendChild(btn);

  badge.style.display = "block";
}

// Set value in a way that works with React/Vue sites too
function fillField(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  navigator.clipboard.writeText(value).catch(() => {});
}

function attach(input) {
  if (input.dataset.passguard) return;
  input.dataset.passguard = "1";
  input.addEventListener("input", () => {
    if (!input.value) { badge.style.display = "none"; return; }
    showBadge(input, analyzePassword(input.value, location.hostname));
  });
  input.addEventListener("blur", () => setTimeout(() => (badge.style.display = "none"), 200));
}

const scan = () => document.querySelectorAll('input[type="password"]').forEach(attach);
scan();
new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });