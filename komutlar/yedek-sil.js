const db = require("quick.db");
const dc = require("discord.js");
const Ashira = new Set();
const backup = require("discord-backup");
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
      let backupID = args[0];
      let a = db.get(`yedek_${backupID}`);
      if (a === message.author.id) {
        let embed = new dc.MessageEmbed()
          .setTitle("`Başarılı`\n")
          .setColor("GREEN")
          .setDescription("**ID sini Girdiğin Yedek Silinmiştir**")
          .setTimestamp()
          .setThumbnail(message.author.avatarURL())
          .setImage("https://i.hizliresim.com/6l257tx.png");
        message.channel.send(embed);
        backup.remove(backupID);
        db.delete(`yedek_${backupID}`);
        db.delete(`toplam_${message.author.id}`, 1);
        db.set(
          `y_${message.author.id}`,
          db.get(`y_${message.author.id}`).filter(z => z.id !== backupID)
        );
      } else {
        message.channel.send(":x: Böyle Bir Yedeğin Yok!");
      }
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
  aliases: [""],
  permLevel: 0
};

exports.help = {
  name: "yedek-sil",
  description: "bot hakkındaki önerilerinizi bot sahiplerine ulaştırır",
  usage: "öneri <mesaj>"
};
