const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

const TRIP_DUE = new Date(2026, 1, 23, 3, 30, 0); // Feb 23, 2026 3:30 AM

function getCountdown() {
  const now = new Date();
  const diff = Math.max(0, TRIP_DUE - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds to go 🏂`;
}

client.on("ready", () => {
  console.log("Bot is ready!");
});

const TARGET_GROUP_ID = "120363044760665478@g.us";

async function handleGroupMessage(message) {
  const chat = await message.getChat();
  const chatId = chat.id._serialized || chat.id;
  if (chatId !== TARGET_GROUP_ID) return;
  if (message.body.toLowerCase() === "/זמן") {
    message.reply(getCountdown());
  }
}

client.on("message", handleGroupMessage);
client.on("message_create", handleGroupMessage);

client.initialize();
