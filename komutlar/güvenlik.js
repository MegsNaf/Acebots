const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
exports.run = async (client, message, args) => {
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

  let prefix = ayarlar.prefix;
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      "Bu komutu kullanabilmek için `Sunucuyu yönet` yetkisine sahip olmalıısn"
    );

  let kanal = message.mentions.channels.first() || args[0];
  if (!kanal)
    return message.channel.send(
      "Güvenlik mesajlarının gideceği kanalı etiketlemedin :x:"
    );
  else {
    db.set(`güvenlik.${message.guild.id}`, kanal.id);
    return message.channel.send(
      "Güvenlik kanalı <#" + kanal + "> olarak ayarlandı"
    );
  }
  if (args[0] === "sıfırla") {
    db.delete(`güvenlik.${message.guild.id}`);
    message.channel.send("Güvenlik kanalı sıfırlandı.");
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permlevel: 0
};

exports.help = {
  name: "güvenlik",
  description: "Güvenlik kanalını ayarlarsınız.",
  usage: "güvenlik #kanal"
};
