const Eco = require("../models/Economy");

// ================= GET USER =================
async function getUser(userId) {
  let user = await Eco.findOne({ userId });

  if (!user) {
    user = await Eco.create({ userId });
  }

  return user;
}

module.exports = {
  name: "eco",

  async execute(message, args) {

    const cmd = args[0];
    const user = await getUser(message.author.id);

    // ================= HELP =================
    if (!cmd || cmd === "help") {
      return message.channel.send(`
💰 ECONOMY COMMANDS

balance, daily, work, beg, deposit, withdraw, send, gamble, steal, leaderboard
      `);
    }

    // ================= BALANCE =================
    if (cmd === "balance") {
      return message.channel.send(`💰 Cash: ${user.cash}\n🏦 Bank: ${user.bank}`);
    }

    // ================= DAILY =================
    if (cmd === "daily") {
      user.cash += 1000;
      await user.save();
      return message.channel.send("🎁 You got 1000 coins!");
    }

    // ================= WORK =================
    if (cmd === "work") {
      const amount = Math.floor(Math.random() * 500) + 100;
      user.cash += amount;
      await user.save();
      return message.channel.send(`💼 You earned ${amount}`);
    }

    // ================= BEG =================
    if (cmd === "beg") {
      const amount = Math.floor(Math.random() * 200);
      user.cash += amount;
      await user.save();
      return message.channel.send(`🪙 You got ${amount}`);
    }

    // ================= DEPOSIT =================
    if (cmd === "deposit") {
      const amount = parseInt(args[1]);
      if (!amount || amount > user.cash) return message.reply("Invalid");

      user.cash -= amount;
      user.bank += amount;
      await user.save();

      return message.channel.send(`🏦 Deposited ${amount}`);
    }

    // ================= WITHDRAW =================
    if (cmd === "withdraw") {
      const amount = parseInt(args[1]);
      if (!amount || amount > user.bank) return message.reply("Invalid");

      user.bank -= amount;
      user.cash += amount;
      await user.save();

      return message.channel.send(`💰 Withdrawn ${amount}`);
    }

    // ================= GAMBLE =================
    if (cmd === "gamble") {
      const amount = parseInt(args[1]);
      if (!amount || amount > user.cash) return message.reply("Invalid");

      const win = Math.random() > 0.5;

      if (win) {
        user.cash += amount;
      } else {
        user.cash -= amount;
      }

      await user.save();

      return message.channel.send(win ? "🎉 You won!" : "💀 You lost!");
    }

    // ================= STEAL =================
    if (cmd === "steal") {
      const target = message.mentions.users.first();
      if (!target) return message.reply("Mention user");

      const tUser = await getUser(target.id);
      const amount = Math.floor(Math.random() * 300);

      tUser.cash -= amount;
      user.cash += amount;

      await user.save();
      await tUser.save();

      return message.channel.send(`🦹 Stole ${amount}`);
    }

    if (cmd === "addmoney") {

  // ===== ADMIN ONLY CHECK =====
  if (!message.member.permissions.has("Administrator")) {
    return message.reply("❌ You need Administrator permission to use this command.");
  }

  const user = message.mentions.users.first();
  if (!user) {
    return message.reply("❌ Please mention a user.\nExample: `!addmoney @user 1000`");
  }

  const amount = parseInt(args[1]);
  if (!amount || isNaN(amount) || amount <= 0) {
    return message.reply("❌ Please provide a valid amount.");
  }

  // ===== INIT USER IF NOT EXIST =====
  if (!db[user.id]) {
    db[user.id] = { cash: 0, bank: 0 };
  }

  // ===== ADD MONEY =====
  db[user.id].cash += amount;

  saveDB(); // make sure you already have this function

  return message.channel.send(
    `💰 Successfully added **${amount}$** to ${user.username}'s cash!`
  );
}

    // ================= LEADERBOARD =================
    if (cmd === "leaderboard") {
      const top = await Eco.find().sort({ cash: -1 }).limit(5);

      let msg = "🏆 Leaderboard:\n";

      top.forEach((u, i) => {
        msg += `${i + 1}. <@${u.userId}> - ${u.cash}\n`;
      });

      return message.channel.send(msg);
    }
  }
};
