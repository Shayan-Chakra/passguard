// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const ARC_LENGTH = 251.33; // length of the gauge arc

// ---------- Password tester ----------
function updateTester() {
  const pw = $("testInput").value;
  const tester = $("tester");
  const list = $("reasons");
  list.replaceChildren();

  if (!pw) {
    tester.dataset.level = "none";
    $("gaugeFill").style.strokeDashoffset = ARC_LENGTH;
    $("levelText").textContent = "Waiting";
    $("scoreText").textContent = "Type below to begin";
    $("hint").style.display = "block";
    return;
  }

  const result = analyzePassword(pw, $("siteInput").value.trim().toLowerCase());
  tester.dataset.level = result.level.toLowerCase();
  $("gaugeFill").style.strokeDashoffset = ARC_LENGTH * (1 - result.score / 100);
  $("levelText").textContent = result.level + " risk";
  $("scoreText").textContent = result.score + " / 100";
  $("hint").style.display = "none";

  if (result.reasons.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No weak patterns found. Nice.";
    list.appendChild(li);
  }
  result.reasons.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r;          // textContent keeps it safe from injected code
    list.appendChild(li);
  });
}

$("testInput").addEventListener("input", updateTester);

$("eyeBtn").addEventListener("click", () => {
  const input = $("testInput");
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  $("eyeBtn").setAttribute("aria-label", show ? "Hide password" : "Show password");
});

// ---------- Generator ----------
function makePassword() {
  const opts = {
    upper: $("optUpper").checked,
    lower: $("optLower").checked,
    numbers: $("optNumbers").checked,
    symbols: $("optSymbols").checked,
  };
  // If everything is switched off, fall back to lowercase so we never return nothing.
  if (!opts.upper && !opts.lower && !opts.numbers && !opts.symbols) {
    opts.lower = true;
    $("optLower").checked = true;
  }
  $("pwOut").textContent = generatePassword(Number($("len").value), opts);
}

$("len").addEventListener("input", () => {
  $("lenVal").textContent = $("len").value;
  makePassword();
});
["optUpper", "optLower", "optNumbers", "optSymbols"].forEach((id) =>
  $(id).addEventListener("change", makePassword)
);
$("refreshBtn").addEventListener("click", makePassword);

$("copyBtn").addEventListener("click", async () => {
  const btn = $("copyBtn");
  try {
    await navigator.clipboard.writeText($("pwOut").textContent);
    btn.textContent = "Copied!";
    btn.classList.add("done");
  } catch (e) {
    btn.textContent = "Copy failed. Select the text and press Ctrl+C";
  }
  setTimeout(() => {
    btn.textContent = "Copy password";
    btn.classList.remove("done");
  }, 1600);
});

// First password on open
makePassword();

// ---------- Demo-only extras ----------
$("siteInput").addEventListener("input", updateTester);

document.querySelectorAll(".examples button").forEach((btn) => {
  btn.addEventListener("click", () => {
    $("testInput").value = btn.dataset.pw;
    $("siteInput").value = btn.dataset.site;
    $("testInput").type = "text";   // show it so visitors can see what was tried
    updateTester();
  });
});
