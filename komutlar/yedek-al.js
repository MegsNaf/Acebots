const backup = require("discord-backup");
const config = require("../ayarlar.json");
const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
const client = new Discord.Client({ intents: 32767 });
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
  let kullanıcı = db.fetch(`gold_${message.author.id}`);

  if (kullanıcı == undefined) {
    message.reply("**Maalesef bu komutu kullanamazsın gold üye değilsin :(**");
  } else {
    if (kullanıcı == "gold") {
      let sa = db.get(`toplam_${message.author.id}`) || "0";
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: Bu Komutu Kullanabilmek İçin `Yönetici` Yetkisine Sahip Olmalısın."
        );
      }
      if (sa < 15) {
        backup.create(message.guild).then(backupData => {
          db.set(`yedek_${backupData.id}`, message.author.id);
          const date = new Date(backupData.createdTimestamp);
          const yyyy = date.getFullYear().toString(),
            mm = (date.getMonth() + 1).toString(),
            dd = date.getDate().toString();
          const formattedDate = `${dd[1] ? dd : "0" + dd[0]}/${
            mm[1] ? mm : "0" + mm[0]
          }/${yyyy}`;
          db.add(`toplam_${message.author.id}`, 1);
          db.push(`y_${message.author.id}`, {
            adı: backupData.name,
            id: backupData.id,
            tarih: formattedDate
          });

          let embed = new Discord.MessageEmbed()
            .setTitle("Yedek Alındı!")
            .setDescription(
              `**Bilgilendirme**\n \n**Yedek ID'si **\n> \`\`\`${backupData.id}\`\`\`\n \n**Yedek Bilgisi İçin**\n> \`\`\`${config.prefix}yedek-bilgi ${backupData.id}\`\`\`\n \n**Yedeği Yüklemek İçin**\n> \`\`\`${config.prefix}yedek-yükle ${backupData.id}\`\`\``
            )
            .setColor("GREEN")
            .setTimestamp()
            .setImage("https://i.hizliresim.com/6l257tx.png")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(
              message.author.tag + " Tarafından Oluşturuldu!",
              message.author.avatarURL({ dynamic: true })
            );
          return message.channel.send(embed);
        });
      }
    }
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
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "yedek-al",
  description: "Tüm komutları gösterir.",
  usage: "panel"
};
