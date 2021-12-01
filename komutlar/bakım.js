const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
const Ashira = new Set();

exports.run = (client, message, args) => {
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
  }

  if (!ayarlar.sahip.includes(message.author.id))
    return message.channel.send("Bunu Sadece Bot Geliştiricileri Yapabilir");

  if (!args[0])
    return message.channel.send("Bakım modunu açmak için !bakım aç");

  if (args[0] === "aç") {
    if (db.fetch(`bakim`)) return message.channel.send("Bakım modu zaten açık");
    message.channel.send("Bakım modu açıldı.");
    db.set(`bakim`, "acik");
  }
  if (args[0] === "kapat") {
    if (!db.fetch(`bakim`))
      return message.channel.send("Bakım modu zaten kapalı.");
    message.channel.send("Bakım modu kapatıldı.");
    db.delete(`bakim`);
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "bakım"
};
