const backup = require("discord-backup");
const config = require("../ayarlar.json");
const prex = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
const client = new prex.Client({ intents: 32767 });
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
      new prex.MessageEmbed()
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
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: Bu Komutu Kullanmak İçin `Yönetici` Yetkisine Sahip Olmalısın!"
        );
      }

      const backupID = args.join(" ");
      let kontrol = db.get(`yedek_${backupID}`);
      if (kontrol !== message.author.id)
        return message.channel.send(":x: Böyle Bir Yedeğe Sahip Değilsin");
      backup
        .fetch(backupID)
        .then(() => {
          let uyarı = new prex.MessageEmbed()
            .setTitle(":warning: Uyarı")
            .setDescription(
              `
        Tüm Kanallar, Roller Ve Ayarlar Sıfırlanacaktır. Devam Etmek İstiyorsanız: \`evet\` İstemiyorsanız: \`hayır\` Yazınız.
        `
            )
            .setColor("RED")
            .setThumbnail(message.guild.iconURL())
            .setFooter(
              message.author.tag + " Tarafından İstendi!",
              message.author.avatarURL()
            )
            .setImage("https://i.hizliresim.com/6l257tx.png");
          message.channel.send(uyarı);

          const collector = message.channel.createMessageCollector(
            m =>
              m.author.id === message.author.id &&
              ["evet", "hayır"].includes(m.content),
            {
              time: 60000,
              max: 1
            }
          );
          collector.on("collect", m => {
            const confirm = m.content === "evet";
            collector.stop();
            if (confirm) {
              backup
                .load(backupID, message.guild)
                .then(() => {
                  return message.author.send("Yedek Başarıyla Yüklendi!");
                })
                .catch(err => {
                  if (err === "No backup found")
                    return message.channel.send(
                      ":x: " + backupID + " ID'li Bir Yedek Bulunmuyor!"
                    );
                  else
                    return message.author.send(
                      ":x: Bir Hata Oluştu: " + (typeof err === "string")
                        ? err
                        : JSON.stringify(err)
                    );
                });
            } else {
              return message.channel.send(":x: İptal Edildi.");
            }
          });

          collector.on("end", (collected, reason) => {
            if (reason === "time")
              return message.channel.send(
                ":x: Komut Zaman Aşımına Uğradı. Lütfen Tekrar Dene"
              );
          });
        })
        .catch(() => {
          return message.channel.send(
            ":x: " + backupID + " ID'li Bir Yedek Bulunmuyor!"
          );
        });
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
  name: "yedek-yükle",
  description: "Çekiliş mi? Sunucunda güzel şeyler olacak :3",
  usage: "çekiliş"
};
