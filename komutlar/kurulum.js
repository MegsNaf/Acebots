const { MessageButton, MessageActionRow } = require("discord-buttons");
const Discord = require("discord.js");
const Ashira = new Set();
module.exports.run = async (bot, message, args) => {
  const db = require("quick.db");
  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  let karaliste = db.get(`karaliste_${message.author.id}`);
  if (karaliste === true)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Erişiminiz Engellendi")
        .setDescription(
          `**Erişiminizin Neden Engellendiğini Öğrenmek İçin [Ace Bot Destek](https://discord.gg/nakvtDCRfV) Sunucusuna Gelip \`MegsNaf yada Rigby Reis\` İle İletişime Geçiniz.**`
        )
        .setTimestamp()
        .setColor("RED")
        .setImage("https://i.hizliresim.com/b3jbgkl.png")
        .setThumbnail(message.author.avatarURL())
    );
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
  }
  message.delete();
  this.bot = bot;
  const stop = new MessageButton()
    .setLabel("Durdur")
    .setStyle("red")
    .setID("stop");
  const pause = new MessageButton()
    .setLabel("Duraklat")
    .setStyle("blurple")
    .setID("pause");
  const resume = new MessageButton()
    .setLabel("Devam Ettir")
    .setStyle("green")
    .setID("resume");
  const skip = new MessageButton()
    .setLabel("Atla")
    .setStyle("grey")
    .setID("skip");
  const que = new MessageButton()
    .setLabel("Sıraya al")
    .setStyle("blurple")
    .setID("que");
  const row = new MessageActionRow()
    .addComponent(stop)
    .addComponent(pause)
    .addComponent(resume)
    .addComponent(skip)
    .addComponent(que);
  const embed = new Discord.MessageEmbed()
    .setTitle("Ace Bot Şarkı Paneli")
    .setImage(`https://i.hizliresim.com/aufr7a7.png`);
  bot.msg = await message.channel.send(embed, row);
  bot.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "müzik-panel",
  description: "Sizin için bir stres çarkı çevirir.",
  usage: "müzik-panel"
};
