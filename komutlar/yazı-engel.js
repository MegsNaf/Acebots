const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
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

  if (!args[0])
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          "Örnek Kullanım: `!yazı-engel ayarla - !yazı-engel sıfırla`"
        )
        .setColor("BLUE")
    );
  if (args[0] === "ayarla") {
    var kanal = message.mentions.channels.first();
    if (!kanal)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription("Kanal Belirtmen Gerek!!")
          .setColor("BLUE")
      );
    db.set(`yazıengel_${message.guild.id}`, kanal.id);
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `Yazı Engel kanalı başarılı ile <#${kanal.id}> olarak ayarlandı!`
        )
        .setColor("BLUE")
    );
  }
  if (args[0] === "sıfırla") {
    if (db.has(`yazıengel_${message.guild.id}`)) {
      db.delete(`yazıengel_${message.guild.id}`);
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription("Başarıyla Sıfırlandı")
          .setColor("BLUE")
      );
    } else {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(
            "Silecek Kanal Ayarlı Değil !yazı-engel ayarla #kanal"
          )
          .setColor("BLUE")
      );
    }
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
  name: "yazı-engel"
};
