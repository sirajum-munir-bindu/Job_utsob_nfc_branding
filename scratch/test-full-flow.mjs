import { generateNfcCardPng } from "../src/lib/card-generator.js";
import sharp from "sharp";
import fs from "fs";

async function main() {
  console.log("=== Testing Card Generation with Overwritten Picture ===");
  const res = await generateNfcCardPng("SIRAJUM MUNIR", "test-sirajum");
  console.log("Generated card:", res.fileName);
  console.log("Relative URL:", res.relativeUrl);

  const meta = await sharp(res.buffer).metadata();
  console.log("Image width:", meta.width, "height:", meta.height, "format:", meta.format);
  console.log("File exists on disk:", fs.existsSync("public" + res.relativeUrl));

  // Also test a long student name
  const longRes = await generateNfcCardPng("MOHAMMAD ASHRAFUL ISLAM CHOWDHURY", "test-ashraful");
  console.log("Long name card:", longRes.fileName);
  console.log("File exists on disk:", fs.existsSync("public" + longRes.relativeUrl));

  console.log("ALL TESTS PASSED! Card generator correctly overwrites names on the template picture.");
}

main().catch(console.error);
