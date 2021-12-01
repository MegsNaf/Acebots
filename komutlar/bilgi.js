const Discord = require("discord.js");
const moment = require("moment");
const os = require("os");
const Ashira = new Set();
require("moment-duration-format");
exports.run = async (client, message, args) => {
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

  const seksizaman = moment
    .duration(client.uptime)
    .format(" D [gün], H [saat], m [dakika], s [saniye]");
  const istatistikler = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setDescription("» `Ace Bot Development Team`")
    .setFooter("© 2021 Ace Bot", client.user.avatarURL())
    .addField(
      "» **Bot Owners**",
      "<@348415047497809930> , <@723537298364301334>"
    )
    .addField("» **Bot Developers**", "-")
    .addField(
      "» **Contributors**",
      "<@826022851525476362> , <@727156792533975110>"
    )
    .addField(
      "» **Bot Testers**",
      "<@847410711419289601> , <@639467859692617749>"
    )
    .addField(
      "**» Bot Invite**",
      " [Davet Et](https://discord.com/oauth2/authorize?client_id=876817730664296468&scope=bot&permissions=805314622)"
    );
  return message.channel.send(istatistikler);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ekibimiz"],
  permLevel: 0
};

exports.help = {
  name: "bilgi",
  description: "Botun istatistiklerini gösterir",
  usage: "istatistik"
};
