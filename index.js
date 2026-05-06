const {
  Client,
  GatewayIntentBits,
  ActivityType,
  Collection
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

client.commands = new Collection();

// =========================================================
// 📂 LOAD COMMANDS
// =========================================================
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name) {
    client.commands.set(command.name, command);
  }
}

// =========================================================
// 💬 MESSAGE HANDLER
// =========================================================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = "+";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd);
  if (command) {
    command.execute(message, args, client);
  }
});

// =========================================================
// 🤖 READY EVENT + MONGO + STATUS
// =========================================================
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // 🔥 MongoDB connect
  await dbConnect();

  // =========================================================
  // 🎮 ROTATING STATUS
  // =========================================================
  const statuses = [
    "💸 An Economy Bot | 👑 Made By Huztro"
  ];

  let i = 0;

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: statuses[0],
        type: ActivityType.Playing
      }
    ]
  });

  setInterval(() => {
    i = (i + 1) % statuses.length;

    client.user.setPresence({
      status: "online",
      activities: [
        {
          name: statuses[i],
          type: ActivityType.Playing
        }
      ]
    });
  }, 10000);
});

// =========================================================
// 🔐 LOGIN
// =========================================================
client.login(process.env.TOKEN);
