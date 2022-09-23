const { addReceiverId, removeReceiverId, plusProcess } = require("./announce");

let client = null;

function initHandleEvent(c) {
  client = c;
}

const handleEvent = async (event) => {
  if (
    event.message.type === "text" &&
    event.message.text.charAt(0) === "!" &&
    event.message.text.replaceAll("!", "").trim().length > 0
  ) {
    console.log(event);
    if (event.message.text.substring(1, 6) === "start") {
      const id =
        event.source.type === "group"
          ? event.source.groupId
          : event.source.userId;
      const receiverId = addReceiverId(id);
      return client
        .replyMessage(event.replyToken, {
          type: "text",
          text: `${receiverId.toString()}`,
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (event.message.text.substring(1, 5) === "stop") {
      const id =
        event.source.type === "group"
          ? event.source.groupId
          : event.source.userId;
      const receiverId = removeReceiverId(id);
      return;
    } else if (
      event.message.text.substring(1, 2) === "+" ||
      event.message.text.substring(1, 2) === "-"
    ) {
      try {
        const op = event.message.text.substring(1, 2);
        const [duration, shift, from] = plusProcess(
          event.message.text.split(" "),
          op === "-" ? true : false
        );
        const replyText =
          shift === 0
            ? `${op}Process ${duration} นาที *Setzero* ตั้งแต่ Slot #${from} น้างับ :P`
            : `${op}Process ${duration} นาที รวม ${shift} นาที ตั้งแต่ Slot #${from} น้างับ :P`;
        return client
          .replyMessage(event.replyToken, {
            type: "text",
            text: replyText,
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        return client
          .replyMessage(event.replyToken, {
            type: "text",
            text: "ใส่คำสั่งบวกลบโปรเซสผิดงับ\nต้องแบบนี้น้า !+ (จำนวนนาที) (จำนวน slot ที่จะบวก)",
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ไม่เข้าใจคำสั่งอ่า ขอโทษทีน้า 😢",
      });
    }
  } else {
    return;
  }
};
module.exports = { handleEvent, initHandleEvent };
