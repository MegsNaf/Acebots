const Discord = require("discord.js");
const backup = require("discord-backup");
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
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: Bu Komutu Kullanabilmek İçin `Yönetici` Yetkisine Sahip Olmalısın!"
        );
      }

      const backupID = args.join(" ");
      let kontrol = await db.get(`yedek_${backupID}`);
      if (message.author.id !== kontrol)
        return message.channel.send(
          ":x: Böyle Bir Yedeğe Sahip Değilsin Yada Yedek ID si Belirtmemişsin"
        );
      if (!backupID) return message.channel.send(":x: Bir Yedek ID'si Belirt!");

      backup
        .fetch(backupID)
        .then(backup => {
          let saa = db
            .get(`y_${message.author.id}`)
            .map(x => `**${x.adı}**\n${x.id}\n`);
          const date = new Date(backup.data.createdTimestamp);
          const yyyy = date.getFullYear().toString(),
            mm = (date.getMonth() + 1).toString(),
            dd = date.getDate().toString();
          const formattedDate = `${dd[1] ? dd : "0" + dd[0]}/${
            mm[1] ? mm : "0" + mm[0]
          }/${yyyy}`;
          let sj;
          sj = backup.data.roles.map(x => x.name).join("\n");
          let a;
          a = backup.data.channels.others.map(x => x.name).join("\n  ") || "\n";
          console.log(a);
          let b;
          b = backup.data.channels.categories
            .map(
              x => `• ${x.name}\n  ${x.children.map(x => x.name).join("\n  ")}`
            )
            .join("\n\n");
          let b2;
          if (b.length > 1024) {
            b2 = `${b.slice(0, 300)} ...`;
          } else {
            b2 = b;
          }
          let a2;
          if (a.length > 1024) {
            a2 = `${a.slice(0, 300)} ...`;
          } else {
            a2 = a;
          }
          const embed = new Discord.MessageEmbed()
            .setAuthor("ℹ️ Yedek Bilgisi", backup.data.iconURL)
            .addField("Sunucu Adı", backup.data.name)
            .addField("Boyutu", backup.size + " kb")
            .addField("Oluşturulma Tarihi", formattedDate)
            .addField("Kanallar", `\`\`\`${a2} \n\n${b2}\`\`\``, true)
            .addField("Roller", "```" + sj + "```", true)
            .setColor("BLUE")
            .setImage("https://i.hizliresim.com/6l257tx.png");
          return message.channel.send(embed);
        })
        .catch(err => {
          if (err === "No backup found")
            return message.channel.send(
              ":x: " + backupID + " ID'li Bir Yedeğin Yok!"
            );
          else
            return message.channel.send(
              ":x: Bir Hata Oluştu: " + (typeof err === "string")
                ? err
                : JSON.stringify(err)
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
  aliases: [""],
  permLevel: 0
};

exports.help = {
  name: "yedek-bilgi",
  description: "taslak",
  usage: "captcha-help"
};
