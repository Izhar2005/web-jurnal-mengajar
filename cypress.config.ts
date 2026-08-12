import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    specPattern: "03_Test_Scripts_and_Automation/cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    screenshotsFolder: "02_Test_Plans_and_Reports/cypress-screenshots",
    videosFolder: "02_Test_Plans_and_Reports/cypress-videos",
  },
});
