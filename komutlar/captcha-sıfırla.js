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

  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send("Yönetici yetkisine sahip olmalısın.");
  let açıkmı = await db.fetch(`premium.${message.guild.id}`);
  if (açıkmı) {
    let veri = await db.fetch(`captchazorluk.${message.guild.id}`);

    if (!veri) return message.reply("Sistem zaten kapalı!");

    db.delete(`captchazorluk.${message.guild.id}`);
    db.delete(`captcharol.${message.guild.id}`);
    db.delete(`captchadil.${message.guild.id}`);
    db.delete(`captchaKanal.${message.guild.id}`);

    message.channel.send("Başarıyla sistem kapatıldı!");
  } else {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `${message.author}, bu komut premium bir komuttur. Bu sunucu da premium bulunmamakta.`
        )
        .setFooter(``)
        .setTimestamp()
        .setTitle(`🔔 Bilgilendirme !`)
        .setColor(`YELLOW`)
    );
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
  aliases: ["captcha-kapat", "captcha-sıfırla"],
  permLevel: 0
};

exports.help = {
  name: "captcha-off",
  description: "taslak",
  usage: "captcha-off"
};
