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
    return message.channel.send("Yönetici yetkisine sahip olmalısınız!");

  let açıkmı = await db.fetch(`premium.${message.guild.id}`);
  if (açıkmı) {
    let zorluk = await db.fetch(`captchazorluk.${message.guild.id}`);
    let rol = await db.fetch(`captcharol.${message.guild.id}`);
    let dil = await db.fetch(`captchadil.${message.guild.id}`);
    let kanal = await db.fetch(`captchaKanal.${message.guild.id}`);

    if (!zorluk) return message.reply("Sistem devre dışı! Lütfen Ayarlayınız!");

    let adım3 = new Discord.MessageEmbed()
      .setTitle("Sistem Ayarları!")
      .addField(
        "Sistem",
        "Rol **»** <@&" +
          rol +
          "> \n\n Zorluk Seviyesi *kanal*»** `" +
          zorluk +
          "` \n\n Log Kanalı **»** `" +
          kanal +
          "`"
      )
      .setFooter("Ace Bot Captcha Sistemi", client.user.avatarURL())
      .setTimestamp()
      .setURL("https://discord.gg/nakvtDCRfV")
      .setColor("BLUE");
    message.channel.send(adım3);

    return;
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
  aliases: ["captcha-ayarlar"],
  permLevel: 0
};

exports.help = {
  name: "captcha-settings",
  description: "taslak",
  usage: "captcha-settings"
};
