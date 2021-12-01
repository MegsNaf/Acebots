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
      `${client.user.username} Kullanıcı Komutları Yardım Menüsü`,
      client.user.avatarURL()
    )
    .setThumbnail(message.author.avatarURL())
    .setColor("RANDOM")
    .setDescription(
      `
> \`!afk -> Afk Moduna Girersiniz\`

> \`!avatar -> Etiketlediğiniz Kişinin Avatarını Gösterir.\`

> \`!server-icon -> Komutu Kullandığın Sunucunun Resmini Gönderir.\`
 
> \`!ping -> Botun Pingini Gösterir.\`

> \`!öneri Bot Hakkında Öneri Yapabilirsiniz.\`

> \`!premium kontrol -> Sunucuda Premium Olup Olmadığını Kontrol Edersiniz.\`

> \`!erişim-kontrol -> Bota Erişiminizin Olup Olmadığını Gösterir.\`

> \`!istatistik -> Botun İstatistiklerini Gösterir.\`

> \`!sunucu-bilgi -> Sunucu Bilgilerini Gösterir.\`

> \`!kullanıcı-bilgi -> Etiketlediğiniz Kullanıcının Bilgilerini Gösterir.\`

> \`!roblox-bilgi -> Yazdığınız Kullanıcının Roblox Bilgilerini Gösterir.\`

> \`!ist -> Sunucudaki Ses ve Yazı İstatistiklerinizi Verir.\`

> \`!ist-sıralama -> Sunucudaki Ses ve Yazı İstatistiklerinin Sıralamasını Verir.\``
    )
    .setFooter(`Yapımcılar : MegsNaf#8221 , Rigby Reis#2883`)
    .setTimestamp()
    .setImage("");
  message.channel.send(embed);
  //sdfjklrjhwehrqweuryweutyweruyweıujıwr
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
  name: "kullanıcı", //ashira
  description: "",
  usage: ""
};
