const Discord = require("discord.js");
const chancejs = require("chance");
const chance = new chancejs();
const Ashira = new Set();
const db = require("quick.db");
const cevaplar = ["SONUÇ : **__TURA__**", "SONUÇ : **__YAZI__**"];

exports.run = function(client, message) {
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
  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }

  var cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

  if (cevap === "SONUÇ : **__YAZI__**") {
    const embedyazı = new Discord.MessageEmbed()
      .setColor(0xf4b942)
      .setDescription(cevap)
      .setThumbnail(
        "https://o.remove.bg/downloads/b9abbb40-e6b5-4c42-8627-9d4e856b6fd0/1TL_obverse-removebg-preview.png"
      );
    message.channel.send(embedyazı);
  } else if (cevap === "SONUÇ : **__TURA__**") {
    const embedtura = new Discord.MessageEmbed()
      .setColor(0xf4b942)
      .setDescription(cevap)
      .setThumbnail(
        "http://upload.wikimedia.org/wikipedia/commons/c/cd/1TL_reverse.png"
      );
    message.channel.send(embedtura);
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
  permLevel: 0
};

exports.help = {
  name: "yazı-tura",
  description: "Yazı-Tura atar.",
  usage: "yazıtura"
};
