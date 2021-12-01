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
      `${client.user.username} Davet Komutları Yardım Menüsü`,
      client.user.avatarURL()
    )
    .setThumbnail(message.author.avatarURL())
    .setColor("RANDOM")
    .setDescription(
      `
> \`!davetler-> Davetlerinizi Kontrol Etmenizi Sağlar\`

> \`!davet-ekle -> Etiketlediğiniz Kullanıcıya Belirlediğiniz Sayı Kadar Davet Ekler.\`

> \`!davet-sil -> Etiketlediğiniz Kullanıcıdan Belirlediğiniz Sayı Kadar Davet Siler.\`
 
> \`!davet-sıfırla -> Etiketlediğiniz Kullanıcının Davetlerini Sıfırlar.\`

> \`!davet-kanal -> Davet Loglarının Tutulacağı Kanalı Ayarlamanızı Sağlar.\`

> \`!davet-kanal-sıfırla -> Davet Kanalını Sıfırlamanızı Sağlar.\`

> \`!davet-oluştur -> Bot Size Özel Bir Davet Linki Oluşturur.\`

> \`!rütbe-ekle -> Hangi Davette Hangi Rolün Verileceğini Ayarlarsınız.\`

> \`!rütbe-sil -> Belirlediğiniz Rolleri Silmenizi Sağlar.\`

> \`!rütbe-liste -> Hangi Davet Sayısında Hangi Rollerin Verildiğini Listeler.\``
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
  name: "davet-yardım", //ashira
  description: "",
  usage: ""
};
