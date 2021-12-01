const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
exports.run = (client, message, args) => {
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

  let help = new Discord.MessageEmbed()
    .setTitle("Captcha Yardım Menüsü")
    .setAuthor(message.member.user.username, message.author.avatarURL())
    .addField(
      "__KOMUTLAR__",
      "` !captcha ` - Captcha sistemi bu komut ile aktifleştirebilirsiniz. \n\n` !captcha-kapat ` - Captcha sistemi bu komut ile devre dışı bırakabilirsiniz. \n\n` !captcha-ayarlar ` - Bot sunucunuzdaki aktif captcha ayarlarını gösterir. \n\n` !captcha-bilgi ` - Captcha Sistemi Hakkında Bilgi Alabilirsiniz`"
    )
    .setFooter("Ace Bot Captcha Sistemi")
    .setTimestamp()
    .setThumbnail(message.author.avatarURL())
    .setColor("RANDOM");
  message.channel.send(help);

  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["captcha​-help", "yardım-captcha"],
  permLevel: 0
};

exports.help = {
  name: "captcha-yardım",
  description: "taslak",
  usage: "captcha-help"
};
