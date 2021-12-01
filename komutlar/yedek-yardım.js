const Discord = require("discord.js");
const Ashira = new Set();

exports.run = (client, message, args) => {
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
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
  }
  const embed = new Discord.MessageEmbed()
    .setAuthor(
      `${client.user.username} Moderasyon Komutları Yardım Menüsü`,
      client.user.avatarURL()
    )
    .setThumbnail(message.author.avatarURL())
    .setColor("RANDOM")
    .setDescription(
      `
> \`!yedek-al -> Sunucunuzu Yedekler ve Size Bir Yedek ID si Verir.\`

> \`!yedek-sil -> ID sini Girdiğiniz Yedeği Veritabanımızdan Kaldırır.\`

> \`!yedek-yükle -> ID sini Girdiğiniz Yedeği Komutu Kullandığınız Sunucuya Aktarır.\`

> \`!yedek-liste -> Aldığınız Yedeklerin Sunucusunu ID sini ve Tarihini Gösterir.\`

> \`!yedek-bilgi -> ID sini Girdiğiniz Yedeğin Bilgilerini Gösterir.\``
    )
    .setFooter(`Yapımcılar : MegsNaf#8221 , Rigby Reis#2883`)
    .setTimestamp()
    .addField(
      "**Komutlar Sadece Gold Üyelere Özeldir**",
      "**Gold Üye İçin Bot Yapımcıları İle İletişime Geçebilirsin**"
    );
  message.channel.send(embed);
  //ashira

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
  name: "yedek", //ashira
  description: "",
  usage: ""
};
