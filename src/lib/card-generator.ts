import sharp from "sharp";
import path from "path";
import fs from "fs";
import { sanitizeFileName } from "./utils";
import { CARD_FONT_BASE64 } from "./card-font-base64";

export interface CardGenerationResult {
  fileName: string;
  relativeUrl: string;
  dataUrl: string;
  buffer: Buffer;
}

// Dimensions for CR80 standard card at ~300 DPI
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 756;

/**
 * Escapes XML/SVG special characters in text
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Computes optimal font size, letter spacing and positioning based on text length
 */
function calculateTypography(name: string) {
  const len = name.length;
  let fontSize = 42;
  let letterSpacing = "3px";

  if (len <= 15) {
    fontSize = 44;
    letterSpacing = "4px";
  } else if (len <= 22) {
    fontSize = 36;
    letterSpacing = "2.5px";
  } else if (len <= 30) {
    fontSize = 30;
    letterSpacing = "1.5px";
  } else if (len <= 40) {
    fontSize = 24;
    letterSpacing = "1px";
  } else {
    fontSize = 20;
    letterSpacing = "0.5px";
  }

  return { fontSize, letterSpacing };
}

/**
 * Generates an ultra-luxurious, official DIU Job Utsob 2026 NFC Card background
 * incorporating the provided official Job Utsob 2026 logo, Skill Jobs branding,
 * microchip geometry, and festival accent motifs.
 */
/**
 * Generates an ultra-luxurious, official DIU Job Utsob 2026 NFC Card background
 */
function generateOfficialJobUtsobCardSvg(): string {
  return `
  <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Premium Dark Obsidian Metallic Background Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080d1a" />
        <stop offset="35%" stop-color="#0e172e" />
        <stop offset="70%" stop-color="#111c38" />
        <stop offset="100%" stop-color="#060913" />
      </linearGradient>

      <!-- Festival Accent Color Wave Gradient -->
      <linearGradient id="festivalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0284c7" stop-opacity="0.85" />
        <stop offset="25%" stop-color="#008751" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.85" />
        <stop offset="75%" stop-color="#d32f2f" stop-opacity="0.85" />
        <stop offset="100%" stop-color="#ec4899" stop-opacity="0.8" />
      </linearGradient>

      <!-- Brushed Metallic Foil Border Gradient -->
      <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4af37" />
        <stop offset="25%" stop-color="#fff4cc" />
        <stop offset="50%" stop-color="#aa7c11" />
        <stop offset="75%" stop-color="#f3e5ab" />
        <stop offset="100%" stop-color="#996515" />
      </linearGradient>

      <!-- EMV / Smart Chip Metallic Contacts Gradient -->
      <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e5c07b" />
        <stop offset="35%" stop-color="#f3e1a0" />
        <stop offset="70%" stop-color="#c99738" />
        <stop offset="100%" stop-color="#8a6114" />
      </linearGradient>

      <!-- Drop Shadow Filter -->
      <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.7"/>
      </filter>
    </defs>

    <!-- Card Base with Rounded Corners -->
    <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="48" ry="48" fill="url(#bgGrad)" />

    <!-- Subtle Tech Grid Texture -->
    <g opacity="0.06" stroke="#38bdf8" stroke-width="1.2">
      <line x1="80" y1="0" x2="80" y2="${CARD_HEIGHT}" />
      <line x1="240" y1="0" x2="240" y2="${CARD_HEIGHT}" />
      <line x1="400" y1="0" x2="400" y2="${CARD_HEIGHT}" />
      <line x1="560" y1="0" x2="560" y2="${CARD_HEIGHT}" />
      <line x1="720" y1="0" x2="720" y2="${CARD_HEIGHT}" />
      <line x1="880" y1="0" x2="880" y2="${CARD_HEIGHT}" />
      <line x1="1040" y1="0" x2="1040" y2="${CARD_HEIGHT}" />
      <line x1="0" y1="120" x2="${CARD_WIDTH}" y2="120" />
      <line x1="0" y1="260" x2="${CARD_WIDTH}" y2="260" />
      <line x1="0" y1="400" x2="${CARD_WIDTH}" y2="400" />
      <line x1="0" y1="540" x2="${CARD_WIDTH}" y2="540" />
      <line x1="0" y1="680" x2="${CARD_WIDTH}" y2="680" />
    </g>

    <!-- Festival Accent Glow Waves at Bottom -->
    <path d="M 0 540 C 350 480, 750 620, 1200 500 L 1200 756 L 0 756 Z" fill="url(#festivalGlow)" opacity="0.14" />
    <path d="M 0 580 C 400 520, 800 680, 1200 560 L 1200 756 L 0 756 Z" fill="url(#festivalGlow)" opacity="0.18" />

    <!-- Top Festival Color Stripe -->
    <rect x="0" y="0" width="${CARD_WIDTH}" height="8" fill="url(#festivalGlow)" />

    <!-- Outer Precision Metallic Card Rim -->
    <rect x="14" y="14" width="${CARD_WIDTH - 28}" height="${CARD_HEIGHT - 28}" rx="38" ry="38" fill="none" stroke="url(#goldBorder)" stroke-width="2.5" opacity="0.5" />

    <!-- TOP-LEFT: Skill Jobs NFC Branding -->
    <g transform="translate(80, 95)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="38" fill="#ffffff">
        skill<tspan fill="#008751">.</tspan><tspan fill="#38bdf8">jobs</tspan>
      </text>
      <text x="0" y="28" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13" fill="#94a3b8">
        SMART NFC IDENTITY
      </text>
    </g>

    <!-- CENTER-LEFT: EMV Smart Chip & Contactless Radio Wave -->
    <g transform="translate(80, 240)">
      <rect x="0" y="0" width="128" height="96" rx="14" ry="14" fill="url(#chipGrad)" stroke="#aa7c11" stroke-width="2" filter="url(#dropGlow)" />
      <line x1="0" y1="48" x2="128" y2="48" stroke="#784e06" stroke-width="1.8" />
      <line x1="42" y1="0" x2="42" y2="96" stroke="#784e06" stroke-width="1.8" />
      <line x1="86" y1="0" x2="86" y2="96" stroke="#784e06" stroke-width="1.8" />
      <circle cx="64" cy="48" r="16" fill="none" stroke="#784e06" stroke-width="1.8" />

      <!-- Contactless Wave Symbol -->
      <g transform="translate(170, 48)" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.9">
        <path d="M 0 -12 A 16 16 0 0 1 0 12" />
        <path d="M 12 -22 A 28 28 0 0 1 12 22" />
        <path d="M 24 -32 A 40 40 0 0 1 24 32" />
        <path d="M 36 -42 A 52 52 0 0 1 36 42" />
      </g>
    </g>

    <!-- Event Tagline & Accreditation -->
    <g transform="translate(80, 400)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="16" fill="#38bdf8">
        DIU JOB UTSOB 2026 • OFFICIAL EVENT PASS
      </text>
    </g>

    <!-- CARDHOLDER NAME CONTAINER -->
    <text x="80" y="525" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13" fill="#64748b">
      CARDHOLDER NAME
    </text>

    <!-- BOTTOM ROW: Security Hologram Badge & Serial Spec -->
    <g transform="translate(80, 680)">
      <text x="0" y="0" font-family="'Courier New', Courier, monospace" font-weight="700" font-size="16" fill="#64748b">
        NFC-ID • 2026-DIU-JOB-UTSOB
      </text>
    </g>

    <g transform="translate(980, 665)">
      <rect x="0" y="-18" width="140" height="32" rx="16" ry="16" fill="#008751" fill-opacity="0.25" stroke="#008751" stroke-width="1.5" />
      <circle cx="20" cy="-2" r="5" fill="#10b981" />
      <text x="36" y="3" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="12" fill="#34d399">
        AUTHENTIC
      </text>
    </g>
  </svg>
  `;
}

/**
 * Creates the SVG text overlay for the custom template (overwriting name on official picture)
 */
function createCustomTemplateOverlaySvg(
  name: string,
  width: number,
  height: number
): string {
  const cleanName = escapeXml(name.toUpperCase());
  let fontSize = 54;
  if (name.length > 28) fontSize = 30;
  else if (name.length > 22) fontSize = 36;
  else if (name.length > 15) fontSize = 44;

  const fontFaceStyle = CARD_FONT_BASE64
    ? `@font-face {
        font-family: 'CardFont';
        src: url('data:font/truetype;charset=utf-8;base64,${CARD_FONT_BASE64}') format('truetype');
        font-weight: 900;
      }`
    : "";

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 1134 662" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${fontFaceStyle}
        .attendee-name {
          font-family: 'CardFont', 'DejaVu Sans', 'Liberation Sans', Arial, Helvetica, sans-serif;
          font-weight: 900;
          font-size: ${fontSize}px;
          letter-spacing: 1.5px;
          fill: #ffffff;
        }
      </style>
      <filter id="customTextShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.9"/>
      </filter>
    </defs>

    <!-- Student Name Only Overwritten on Template -->
    <text x="90" y="390" class="attendee-name" filter="url(#customTextShadow)">
      ${cleanName}
    </text>
  </svg>
  `;
}

/**
 * Generates the high-resolution personalized NFC Card PNG
 */
export async function generateNfcCardPng(
  studentName: string,
  studentId: string
): Promise<CardGenerationResult> {
  const sanitized = sanitizeFileName(studentName);
  const fileName = `JOB_UTSOB_2026_${sanitized}.png`;

  // Check output directory (with serverless safe fallback)
  const publicDir = path.join(process.cwd(), "public");
  const outputDir = path.join(publicDir, "generated-cards");
  const outputPath = path.join(outputDir, `${studentId}_${fileName}`);
  let relativeUrl = `/generated-cards/${studentId}_${fileName}`;

  // Check if an existing supplied custom card template exists
  const templatePngPath = path.join(publicDir, "assets", "nfc-card-template.png");
  const templateJpgPath = path.join(publicDir, "assets", "nfc-card-template.jpg");
  const logoPath = path.join(publicDir, "assets", "job-utsob-logo.png");

  let baseCardSharp: sharp.Sharp;
  const compositeLayers: sharp.OverlayOptions[] = [];

  const templatePath = fs.existsSync(templatePngPath)
    ? templatePngPath
    : fs.existsSync(templateJpgPath)
    ? templateJpgPath
    : null;

  if (templatePath) {
    // Supplied custom card template: overwrite student name & typography onto this picture
    const meta = await sharp(templatePath).metadata();
    const width = meta.width || 1134;
    const height = meta.height || 662;

    baseCardSharp = sharp(templatePath);

    const overlaySvg = createCustomTemplateOverlaySvg(studentName, width, height);
    compositeLayers.push({
      input: Buffer.from(overlaySvg),
      top: 0,
      left: 0,
    });
  } else {
    // Generate official base card fallback
    const baseSvg = generateOfficialJobUtsobCardSvg();
    baseCardSharp = sharp(Buffer.from(baseSvg));

    // Composite Job Utsob 2026 Logo Badge in top right corner
    let resolvedLogoPath = fs.existsSync(logoPath)
      ? logoPath
      : fs.existsSync(path.join(publicDir, "assets", "job-utsob-logo.jpg"))
      ? path.join(publicDir, "assets", "job-utsob-logo.jpg")
      : null;

    if (resolvedLogoPath) {
      const logoBadgeSize = 220;
      const center = logoBadgeSize / 2;
      const radius = center - 4;

      const circularWhiteBadgeSvg = `
        <svg width="${logoBadgeSize}" height="${logoBadgeSize}" viewBox="0 0 ${logoBadgeSize} ${logoBadgeSize}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${center}" cy="${center}" r="${radius}" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" />
        </svg>
      `;

      const whiteCircleBuffer = await sharp(Buffer.from(circularWhiteBadgeSvg)).png().toBuffer();
      
      const resizedLogo = await sharp(resolvedLogoPath)
        .resize(176, 176, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();

      const finalBadgeBuffer = await sharp(whiteCircleBuffer)
        .composite([{ input: resizedLogo, top: 22, left: 22 }])
        .png()
        .toBuffer();

      compositeLayers.push({
        input: finalBadgeBuffer,
        top: 60,
        left: 900,
      });
    }

    // Generate the standard name overlay SVG
    const nameOverlaySvg = createCustomTemplateOverlaySvg(studentName, CARD_WIDTH, CARD_HEIGHT);
    compositeLayers.push({
      input: Buffer.from(nameOverlaySvg),
      top: 0,
      left: 0,
    });
  }

  // Composite all layers into the final high-res PNG
  const finalImageBuffer = await baseCardSharp
    .composite(compositeLayers)
    .png({
      quality: 100,
      compressionLevel: 8,
      adaptiveFiltering: true,
    })
    .toBuffer();

  const dataUrl = `data:image/png;base64,${finalImageBuffer.toString("base64")}`;

  // Save the PNG to disk if writeable, otherwise seamlessly use dataUrl on serverless (e.g. Vercel)
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, finalImageBuffer);
  } catch (fsErr) {
    // Vercel serverless read-only filesystem: use dataUrl
    relativeUrl = dataUrl;
  }

  return {
    fileName,
    relativeUrl,
    dataUrl,
    buffer: finalImageBuffer,
  };
}
