import * as dotenv from "dotenv";
import * as readline from "readline";
import { initAnnouncer } from "./announcer";
import { initClient } from "./client";
import { configs } from "./config";
import { setWebhookEndpointUrl, testWebhookEndpointUrl } from "./client";
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const env = dotenv.config().parsed;
const { PROCESS_FILE_NAME, ALLOW_PUSH_MESSAGE } = configs;
function validURL(str: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
}
async function setWebhook(webhookURL: string) {
  if (validURL(webhookURL)) {
    console.log(
      `Set webhook endpoint URL: ${
        (await setWebhookEndpointUrl(webhookURL)) ? "Success" : "Failed"
      }`
    );
  }
  console.log(
    `Test webhook endpoint URL: ${(await testWebhookEndpointUrl()) ? "Success" : "Failed"}`
  );
  readlineInterface.close();
}
function initSystem(lineConfig: { channelAccessToken: string; channelSecret: string }) {
  Promise.all([initClient(lineConfig), initAnnouncer()]).then(() => {
    console.log(
      `process-file: ${PROCESS_FILE_NAME}, NODE_ENV: ${
        env!.NODE_ENV
      }, Allow push messages: ${ALLOW_PUSH_MESSAGE}`
    );
    readlineInterface.question("Set webhook endpoint URL (optional): ", setWebhook);
  });
}
export { initSystem };
