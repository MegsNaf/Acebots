const db = require("quick.db");
const Discord = require("discord.js");
const Ashira = new Set();
exports.run = async (bot, message, args) => {
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

  if (!args[0])
    return message.channel.send(
      "Hey Bu Ayarı Kullanabilmek için `aç` yada `kapat` yazmalısın!"
    );
  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.channel.send("`SUNUCUYU_YÖNET` yetkisine sahip olmalısın!");

  if (args[0] == "aç") {
    var i = await db.set(`reklam_${message.guild.id}`, "acik");

    message.channel.send(
      "Reklam Engel başarıyla açıldı! `Üyeleri Yasakla` yetkisine sahip olanların reklamı engellenmicektir."
    );
  }

  if (args[0] == "kapat") {
    var i = await db.set(`reklam_${message.guild.id}`, "kapali");
    message.channel.send(
      "Reklam Engel başarıyla kapatıldı! Artık herkes reklam yapabilir."
    );
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
  aliases: ["advertisement", "reklam", "reklam-engel"],
  permLevel: 0
};

exports.help = {
  name: "reklamengel",
  description: "[Admin Komutu]",
  usage: "reklamengel"
};
