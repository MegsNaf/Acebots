const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
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

  if (!args[0]) {
    const sa = new Discord.MessageEmbed()
      .setDescription(`Bunu mu Arıyorsun? ${prefix}kanal-koruma aç/kapat`)
      .setTimestamp();
    return message.channel.send(sa);
  }
  if (args[0] === "aç") {
    db.set(`kanalk_${message.guild.id}`, "Aktif");
    const sa = new Discord.MessageEmbed()
      .setDescription(`Kanal Koruma Başarıyla Açıldı!`)
      .setTimestamp();
    return message.channel.send(sa);
  }
  if (args[0] === "kapat") {
    db.delete(`kanalk_${message.guild.id}`);
    const sa = new Discord.MessageEmbed()
      .setDescription(`Kanal Koruma Başarıyla Kapatıldı!`)
      .setTimestamp();
    return message.channel.send(sa);
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: "kanal-koruma"
};
