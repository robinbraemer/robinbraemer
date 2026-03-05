#!/usr/bin/env node
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, "cv.html");
const pdfPath = join(__dirname, "cv.pdf");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await page.pdf({
  path: pdfPath,
  format: "Letter",
  printBackground: true,
  margin: { top: "0.35in", bottom: "0.35in", left: "0.5in", right: "0.5in" },
});
await browser.close();
console.log("PDF saved to", pdfPath);
