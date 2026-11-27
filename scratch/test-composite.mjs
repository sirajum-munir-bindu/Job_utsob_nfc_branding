import sharp from "sharp";
import fs from "fs";

async function testLongName() {
  const templatePath = "public/demo-cards/DEMO_NFC-_1-01_e4691aa3.png";
  const width = 1134;
  const height = 662;
  const name = "MOHAMMAD ASHRAFUL ISLAM CHOWDHURY";
  
  // calculate font size
  let fontSize = 52;
  if (name.length > 28) fontSize = 28;
  else if (name.length > 22) fontSize = 34;
  else if (name.length > 15) fontSize = 42;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
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
      ${name}
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

  const buf = await sharp(templatePath)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
  fs.writeFileSync("C:/Users/dclid/.gemini/antigravity/brain/1df8a9d2-f64b-48c8-8276-d40e2e39c823/test_composite_long.png", buf);
  console.log("Generated test_composite_long.png");
}

testLongName().catch(console.error);
