import sharp from "sharp";
import fs from "fs";

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

async function updateCard() {
  const templatePath = "public/assets/nfc-card-template.png";
  const meta = await sharp(templatePath).metadata();
  const width = meta.width || 1134;
  const height = meta.height || 662;
  const name = "SIRAJUM MUNIR";
  const cleanName = escapeXml(name.toUpperCase());

  let fontSize = 54;
  if (name.length > 28) fontSize = 30;
  else if (name.length > 22) fontSize = 36;
  else if (name.length > 15) fontSize = 44;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 1134 662" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="customTextShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.9"/>
      </filter>
    </defs>
    <text x="90" y="390" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="1.5px" fill="#ffffff" filter="url(#customTextShadow)">
      ${cleanName}
    </text>
  </svg>
  `;

  const buf = await sharp(templatePath)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ quality: 100 })
    .toBuffer();

  const outPath = "public/generated-cards/e2b36f06-8b4a-4772-9f2c-9d808d1cdab0_JOB_UTSOB_2026_SIRAJUM_MUNIR.png";
  fs.writeFileSync(outPath, buf);
  fs.writeFileSync("C:/Users/dclid/.gemini/antigravity/brain/1df8a9d2-f64b-48c8-8276-d40e2e39c823/sirajum_name_only.png", buf);

  // Update display.json
  const dispPath = ".data/display.json";
  if (fs.existsSync(dispPath)) {
    const d = JSON.parse(fs.readFileSync(dispPath, "utf8"));
    d.updatedAt = new Date().toISOString();
    fs.writeFileSync(dispPath, JSON.stringify(d, null, 2));
  }
  console.log("Successfully regenerated card with NAME ONLY and updated display!");
}

updateCard().catch(console.error);
