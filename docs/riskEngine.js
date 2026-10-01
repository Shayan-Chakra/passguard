function analyzePassword(pw, hostname) {
  if (!pw) return { score: 0, level: "Low", reasons: [] };

  const reasons = [];
  const z = zxcvbn(pw.slice(0, 100));       // zxcvbn gives 0 (worst) to 4 (best)
  let risk = (4 - z.score) * 25;            // convert to 0-100 risk

  if (z.feedback.warning) reasons.push(z.feedback.warning);

  // Rule: length
  if (pw.length < 12) { risk += 10; reasons.push("Shorter than 12 characters"); }

  // Rule: character variety
  const types = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
  if (types < 3) { risk += 10; reasons.push("Uses few character types"); }

  // Rule: repeated characters (aaa, 111)
  if (/(.)\1{2,}/.test(pw)) { risk += 10; reasons.push("Contains repeated characters"); }

  // Rule: years (1990, 2026)
  if (/(19|20)\d{2}/.test(pw)) { risk += 10; reasons.push("Contains a year"); }

  // Rule: keyboard patterns
  const patterns = ["qwerty", "asdf", "zxcv", "1234", "12345", "qazwsx"];
  if (patterns.some(p => pw.toLowerCase().includes(p))) {
    risk += 15; reasons.push("Contains a keyboard pattern");
  }

  // Rule: website name inside password (context awareness)
  const siteName = (hostname || "").replace(/^www\./, "").split(".")[0];
  if (siteName.length >= 3 && pw.toLowerCase().includes(siteName)) {
    risk += 20; reasons.push("Contains the website's name");
  }

  risk = Math.min(100, risk);
  return { score: risk, level: getLevel(risk), reasons };
}

function getLevel(score) {
  if (score < 30) return "Low";
  if (score < 60) return "Moderate";
  if (score < 80) return "High";
  return "Critical";
}