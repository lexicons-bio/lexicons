import { test, expect } from "@playwright/test";

test.describe("Navigation links", () => {
  test("navigates between all pages via nav bar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "lexicons.bio" })).toBeVisible();

    const nav = page.getByRole("banner");

    await nav.getByRole("link", { name: "Occurrence" }).click();
    await expect(page).toHaveURL(/#\/occurrence/);
    await expect(page.getByRole("heading", { name: "Occurrence", level: 4 })).toBeVisible();

    await nav.getByRole("link", { name: "Identification" }).click();
    await expect(page).toHaveURL(/#\/identification/);
    await expect(page.getByRole("heading", { name: "Identification", level: 4 })).toBeVisible();

    await nav.getByRole("link", { name: "Media" }).click();
    await expect(page).toHaveURL(/#\/media/);
    await expect(page.getByRole("heading", { name: "Media", level: 4 })).toBeVisible();

    await nav.getByRole("link", { name: "Overview" }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole("heading", { name: "lexicons.bio" })).toBeVisible();
  });
});

test.describe("Lexicon card routing", () => {
  test("Occurrence card navigates to detail page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("A biodiversity observation —").click();
    await expect(page).toHaveURL(/#\/occurrence/);
    await expect(page.getByRole("heading", { name: "Occurrence", level: 4 })).toBeVisible();
  });

  test("Identification card navigates to detail page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("A taxonomic determination").click();
    await expect(page).toHaveURL(/#\/identification/);
    await expect(page.getByRole("heading", { name: "Identification", level: 4 })).toBeVisible();
  });

  test("Media card navigates to detail page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("A media resource documenting").click();
    await expect(page).toHaveURL(/#\/media/);
    await expect(page.getByRole("heading", { name: "Media", level: 4 })).toBeVisible();
  });
});

test.describe("Catch-all redirect", () => {
  test("redirects unknown routes to overview", async ({ page }) => {
    await page.goto("/#/nonexistent-page");
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole("heading", { name: "lexicons.bio" })).toBeVisible();
  });
});
