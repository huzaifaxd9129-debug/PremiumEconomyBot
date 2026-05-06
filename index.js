const {
  Client,
  GatewayIntentBits,
  ActivityType
} = require("discord.js");

const fs = require("fs");
const dbConnect = require("./database");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Map();

// ================= LOAD COMMANDS =================
const files = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of files) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

// ================= MESSAGE HANDLER =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = "+";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd);
  if (command) command.execute(message, args, client);
});

// ================= READY + STATUS =================
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  await dbConnect();

  const statuses = [
    "💸 An Economy Bot | 👑 Made By Huztro",
  ];

  let i = 0;

  client.user.setPresence({
    status: "online",
    activities: [{ name: statuses[0], type: ActivityType.Playing }]
  });

  setInterval(() => {
    i = (i + 1) % statuses.length;

    client.user.setPresence({
      status: "online",
      activities: [{ name: statuses[i], type: ActivityType.Playing }]
    });
  }, 10000);
});

client.login(process.env.TOKEN);
