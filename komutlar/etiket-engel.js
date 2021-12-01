const db = require("quick.db");
const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
let prefix = ayarlar.prefix;
const Ashira = new Set();
exports.run = async (client, message, args) => {
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

  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.reply(
      `Bu komutu kullanabilmek için **Sunucuyu Yönet** iznine sahip olmalısın!`
    );
  if (!args[0]) {
    const kinda = new Discord.MessageEmbed()

      .setDescription(
        "Lütfen **aç** Veya **kapat** Yazın. Örnek Kullanım : **!etiket-engel aç/kapat**"
      )
      .setColor("RED");

    return message.channel.send(kinda);
  }

  if (args[0] == "aç") {
    db.set(`hereengel_${message.guild.id}`, "acik");

    const kinda = new Discord.MessageEmbed()

      .setDescription("Ever-Here Engel Başarılı Bir Şekilde Aktif Edildi!")
      .setColor("GREEN");

    return message.channel.send(kinda);
  }
  //lrowsxrd
  if (args[0] == "kapat") {
    db.set(`hereengel_${message.guild.id}`, "kapali");

    const kinda = new Discord.MessageEmbed()

      .setDescription("Ever-Here Engel Başarılı Bir Şekilde Deaktif Edildi!")
      .setColor("GREEN");

    return message.channel.send(kinda);
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ever-here-engel", "everhere-engel", "ever-hereengel"],
  permLevel: 0
};

exports.help = {
  name: "etiket-engel",
  description: "ever-here engel sistemi",
  usage: "everhereengel"
};
