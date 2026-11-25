import { expect, test } from "@playwright/test";

test("plays a full game to a win and starts a new game", async ({ page }) => {
  await page.goto("/");

  await page.screenshot({
    path: "playwright/screenshots/board.png",
    fullPage: true,
  });

  // X takes the top row; O plays down the left.
  const moves = [0, 3, 1, 4, 2];
  for (const index of moves) {
    await page.getByTestId(`cell-${index}`).click();
  }

  await expect(page.getByTestId("status-banner")).toHaveText(
    "X takes the round.",
  );
  await expect(page.getByTestId("win-line")).toBeVisible();
  await expect(page.getByTestId("score-x")).toHaveText("1");

  await page.screenshot({
    path: "playwright/screenshots/win.png",
    fullPage: true,
  });

  await page.getByTestId("new-game").click();

  for (let index = 0; index < 9; index += 1) {
    await expect(page.getByTestId(`cell-${index}`)).toHaveAttribute(
      "aria-label",
      /empty/,
    );
  }
  await expect(page.getByTestId("status-banner")).toHaveText("");
});

test("reports a draw and counts it on the scoreboard", async ({ page }) => {
  await page.goto("/");

  // X O X / X O O / O X X
  const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  for (const index of moves) {
    await page.getByTestId(`cell-${index}`).click();
  }

  await expect(page.getByTestId("status-banner")).toHaveText(
    "A hard-fought draw.",
  );
  await expect(page.getByTestId("score-draws")).toHaveText("1");
  await expect(page.getByTestId("win-line")).toHaveCount(0);
});

test("AI mode answers the opening move", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("mode-ai").click();
  await page.getByTestId("cell-0").click();

  // Hard AI replies in the centre after a corner opening.
  await expect(page.getByTestId("cell-4")).toHaveAttribute(
    "aria-label",
    /O/,
  );
  await expect(page.getByTestId("turn-indicator")).toHaveText(/Your move/);
});
