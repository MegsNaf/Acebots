const Discord = require("discord.js");

const db = require("quick.db");

const ayarlar = require("../ayarlar.json");

const Ashira = new Set();

var p = ayarlar.prefix;

exports.run = async (bot, message, args) => {
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
  }
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

  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.reply("Yetkiniz Bulunmamaktadır!");

  if (!args[0]) return message.reply(`Kullanmak İçin : ${p}sa-as aç/kapat`);

  if (args[0] == "aç") {
    var durum = await db.fetch(`saas_${message.guild.id}`);
    if (durum == "acik")
      return message.channel.send(
        "Önceden Açılmış Bir Şeyi **Şimdi** __Açamazsın!__"
      );

    db.set(`saas_${message.guild.id}`, "acik");

    message.channel.send(`\`SA-AS Sistemi Açıldı\``);
  }

  if (args[0] == "kapat") {
    var durum = await db.fetch(`saas_${message.guild.id}`);
    if (durum == "kapali")
      return message.channel.send(
        "Önceden Kapanmış Bir Şeyi **Şimdi** __Kapatamazsın!__"
      );

    db.set(`saas_${message.guild.id}`, "kapali");

    message.channel.send(`\`SA-AS Sistemi Kapatıldı\``);
  }
  bot.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,

  guildOnly: false,

  aliases: [""],

  permLevel: 0
};

exports.help = {
  name: "sa-as",

  description: "Botun Sa Yazana Cevap Versin mi Vermesin mi?",

  usage: "sa-as aç/kapat"
};
