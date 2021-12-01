const Discord = require("discord.js");
const Ace = new Set();
const db = require("quick.db");
exports.run = function(client, message, args) {
  if (Ace.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ace.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ace.delete(message.author.id);
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

  var öneri = args.slice(0).join(" ");
  var guildID = "875682410086412308";
  var channelID = "881805226422722601";

  if (!öneri) {
    return message.reply(
      "D-Dostum Bir Mesaj Yazman Lazım Ulen! Doğru kullanım: **!öneri <mesaj>**"
    );
  } else {
    var embed = new Discord.MessageEmbed()
      .setTimestamp()
      .addField("Eylem:", "Öneri")
      .addField("Kullanıcı:", message.author.tag)
      .addField("ID", message.author.id)
      .addField("Öneri", öneri);

    client.guilds.cache
      .get(guildID)
      .channels.cache.get(channelID)
      .send(embed);
    message.channel.send("Öneriniz alınmıştır!.");
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
  aliases: ["öner"],
  permLevel: 0
};

exports.help = {
  name: "öneri",
  description: "bot hakkındaki önerilerinizi bot sahiplerine ulaştırır",
  usage: "öneri <mesaj>"
};
