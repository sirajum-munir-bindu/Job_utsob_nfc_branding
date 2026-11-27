import sharp from "sharp";
import fs from "fs";
import path from "path";

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

async function test() {
  const templatePath = "public/assets/nfc-card-template.png";
  const meta = await sharp(templatePath).metadata();
  const width = meta.width || 1134;
  const height = meta.height || 662;
  const studentName = "BOSS";
  const cleanName = escapeXml(studentName.toUpperCase());

  let fontSize = 52;
  if (cleanName.length > 28) fontSize = 28;
  else if (cleanName.length > 22) fontSize = 34;
  else if (cleanName.length > 15) fontSize = 42;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 1134 662" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.9"/>
      </filter>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#818cf8" />
        <stop offset="100%" stop-color="#c084fc" />
      </linearGradient>
    </defs>
    
    <g transform="translate(90, 310)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3px" fill="#94a3b8">
        CARDHOLDER / ATTENDEE
      </text>
    </g>

    <text x="90" y="380" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="1.5px" fill="#ffffff" filter="url(#shadow)">
      ${cleanName}
    </text>

    <g transform="translate(90, 440)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5px" fill="url(#accentGrad)">
        DIU JOB UTSOB 2026
      </text>
      <text x="0" y="26" font-family="'Courier New', monospace" font-size="14" font-weight="600" letter-spacing="2px" fill="#64748b">
        SMART NFC IDENTITY • skill.jobs
      </text>
    </g>
  </svg>
  `;

  const finalBuf = await sharp(templatePath)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ quality: 100 })
    .toBuffer();

  const outPath = "public/generated-cards/bdd1e8b2-e52e-4703-9fe7-cb0e3f46ea0d_JOB_UTSOB_2026_BOSS.png";
  fs.writeFileSync(outPath, finalBuf);
  fs.writeFileSync("C:/Users/dclid/.gemini/antigravity/brain/1df8a9d2-f64b-48c8-8276-d40e2e39c823/boss_overwritten_card.png", finalBuf);
  console.log("Successfully generated Boss overwritten card!");
}

test().catch(console.error);
