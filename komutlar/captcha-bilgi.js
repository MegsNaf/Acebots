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

  let bilgilendirme = new Discord.MessageEmbed()
    .setTitle("Sistem Bilgilendirmesi")
    .setDescription(
      "**Captcha Nedir?** \n\n Captcha, botlara karşı önlem olarak etkili bir çözümdür. Bu test bilgisayarların çözemeyeceği ama insanların çözebileceği şeklinde testlerden oluşan testlerdir. "
    )
    .addField(
      "Ne işe yarar?",
      "Sunucunuza biri geldiğinde **Botunuz** onlara bir DM mesajı gönderir.Bu mesajda bulunan resimdeki karakterleri 3 kere yanlış girerlerse bot belirtilen rolü vermeyecektir.Eğer karakterler doğru girilirse bot rolü verir."
    )
    .addField(
      "Zorluk Dereceleri",
      "Birazdan kurulumu tamamlarken,size **Zorluk Derecesi** soracaktır.Bunlar; `kolay,orta,zor` olarak üç'e ayrılır.Zorluk derecesi ne kadar yükselirse bot o kadar zor kodlar gönderir.Tavsiye Ayarımız: **orta**"
    )
    .setFooter("Ace Bot Captcha Sistemi", client.user.avatarURL())
    .setTimestamp()
    .setURL("https://discord.gg/nakvtDCRfV")
    .setColor("BLUE");
  message.channel.send(bilgilendirme);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["captcha-bilgi", "bilgi-captcha"],
  permLevel: 0
};

exports.help = {
  name: "info-captcha",
  description: "taslak",
  usage: "captcha-info"
};
