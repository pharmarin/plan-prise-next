import type { Page } from "@playwright/test";

const logConsole = (page: Page) => {
  page.on("console", async (msg) => {
    try {
      process.env.TEST_LOG &&
        console.log(
          `Browser console (${msg.type()}) during test: `,
          await Promise.all(
            msg.args().map(async (arg) => (await arg.jsonValue()) as JSON),
          ),
          msg.location(),
        );
    } catch (error) {
      console.error("Error logging: ", error);
    }
  });
};

export default logConsole;
