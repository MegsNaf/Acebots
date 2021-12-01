const db = require("quick.db");
const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const Ashira = new Set();
let prefix = ayarlar.prefix;

exports.run = function(client, message, args) {
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

  var USER = message.author;
  var REASON = args.slice(0).join("  ");
  const embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setDescription(
      `Afk Olmak İçin Bir Sebep Belirtin.\n\n Örnek Kullanım : !afk <sebep>`
    );
  if (!REASON) return message.channel.send(embed);
  db.set(`afk_${USER.id}`, REASON);
  db.set(`afk_süre_${USER.id}`, Date.now());
  const afk = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(message.author.username, message.author.avatarURL)
    .setDescription(
      `Başarıyla ${REASON} Sebebiyle \`Afk\` Moduna Başarıyla Girildi.`
    );
  message.channel.send(afk);

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
  name: "afk",
  description: "afk komutu",
  usage: "afk"
};
