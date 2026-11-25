import { expect, test } from "@playwright/test";

// Temporary diagnostic spec — remove before submission.
test("debug rendering", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("cell-0").click();
  await page.getByTestId("cell-4").click();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "playwright/screenshots/debug-mid.png",
    fullPage: true,
  });

  const mark = await page.evaluate(() => {
    const path = document.querySelector(
      '[data-testid="cell-0"] svg path',
    ) as SVGPathElement | null;
    if (!path) return null;
    const cs = getComputedStyle(path);
    const r = path.getBoundingClientRect();
    return {
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
      dasharray: cs.strokeDasharray,
      dashoffset: cs.strokeDashoffset,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      length: path.getTotalLength(),
    };
  });
  console.log("MARK " + JSON.stringify(mark));

  await page.getByTestId("cell-1").click();
  await page.getByTestId("cell-3").click();
  await page.getByTestId("cell-2").click();

  await expect(page.getByTestId("win-line")).toBeVisible();
  await page.waitForTimeout(900);
  await page.screenshot({
    path: "playwright/screenshots/debug-win.png",
    fullPage: true,
  });

  const line = await page.evaluate(() => {
    const el = document.querySelector(
      '[data-testid="win-line"] line',
    ) as SVGLineElement | null;
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const svg = el.closest("svg") as SVGSVGElement;
    const sr = svg.getBoundingClientRect();
    return {
      stroke: cs.stroke,
      width: cs.strokeWidth,
      dasharray: cs.strokeDasharray,
      dashoffset: cs.strokeDashoffset,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      svgRect: { x: sr.x, y: sr.y, w: sr.width, h: sr.height },
      x1: el.getAttribute("x1"),
      x2: el.getAttribute("x2"),
      y1: el.getAttribute("y1"),
      preserveAspectRatio: svg.getAttribute("preserveAspectRatio"),
    };
  });
  console.log("LINE " + JSON.stringify(line));
});
