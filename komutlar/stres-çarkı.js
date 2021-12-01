const Discord = require("discord.js");
const Ashira = new Set();
const db = require("quick.db");

exports.run = async (client, message) => {
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
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

  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  let dönme = await message.channel.send({
    embed: {
      color: 0x00ae86,
      description: `${message.author.tag} bir stres çarkı çevirdi!`,
      image: {
        url: "https://i.imgur.com/KJJxVi4.gif"
      }
    }
  });

  let bitiş = Math.random() * (60 - 5 + 1) + 5;
  setTimeout(() => {
    dönme.edit({
      embed: {
        color: 0x00ae86,
        description: `${message.author.tag}, stres çarkın ${bitiş.toFixed(
          2
        )} saniye döndü.`
      }
    });
  }, 5 * 1000);

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
  permLevel: 0
};

exports.help = {
  name: "stres-çarkı",
  description: "Sizin için bir stres çarkı çevirir.",
  usage: "stresçarkı"
};
