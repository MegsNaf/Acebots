const db = require("quick.db");
const dc = require("discord.js");
const Ashira = new Set();
const client = new dc.Client({ intents: 32767 });
exports.run = async (client, message, args) => {
  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  let karaliste = db.get(`karaliste_${message.author.id}`);
  if (karaliste === true)
    return message.channel.send(
      new dc.MessageEmbed()
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
  let kullanıcı = db.fetch(`gold_${message.author.id}`);

  if (kullanıcı == undefined) {
    message.reply("**Maalesef bu komutu kullanamazsın gold üye değilsin :(**");
  } else {
    if (kullanıcı == "gold") {
      let yedekler = await db.get(`y_${message.author.id}`);
      let sj;
      if (!yedekler) {
        sj = "Yedeğin Bulunmamakta";
      } else {
        sj = yedekler.map(
          x =>
            `**Yedek ID** : \`${x.id}\`\n**Sunucu Adı** : \`${x.adı}\`\n**Oluşturma Tarihi** : \`${x.tarih}\`\n`
        );
      }
      let embed = new dc.MessageEmbed()
        .setTitle("📄 Yedek Listesi")
        .setColor("GREEN")
        .setTimestamp()
        .setThumbnail(message.author.avatarURL())
        .setDescription(sj)
        .setImage("https://i.hizliresim.com/6l257tx.png");
      message.channel.send(embed);
      client.channels.cache
        .get("878311926524944395")
        .send(
          `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
        );
    }
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: "yedek-liste",
  description: "Çekiliş mi? Sunucunda güzel şeyler olacak :3",
  usage: "çekiliş"
};
