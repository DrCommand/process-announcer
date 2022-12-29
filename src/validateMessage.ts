import axios from "axios";
import * as dotenv from "dotenv";
const env = dotenv.config().parsed;
const config = {
  headers: {
    Authorization: `Bearer ${
      env.NODE_ENV === "development" ? env.ACCESS_TOKEN_DEMO : env.ACCESS_TOKEN
    }`,
  },
};
async function validatePushMessage(messages: Array<any>) {
  await axios
    .post("https://api.line.me/v2/bot/message/validate/push", { messages: messages }, config)
    .then((res) => {
      console.log("results: ", res.data);
    })
    .catch((err) => {
      console.log("error: ", err.response.data);
    });
}
export { validatePushMessage };
