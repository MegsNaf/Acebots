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

  let prefix = "!";

  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.channel.send(`**Buna Yetkin Yok!**`);
  if (!["kapat", "aç"].includes(args[0])) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(`${client.user.username} Destek Sistemi`)
        .setDescription(
          `**\`${prefix}destek aç @YETKİLİ_ROL #KANAL\` veya \`${prefix}destek kapat\`**`
        )
        .setFooter(
          `Komutu Kullanan: ${message.author.tag}`,
          `${message.author.avatarURL()}`
        )
    );
  }

  if (args[0] == "kapat") {
    if (!db.get("csticket." + message.guild.id))
      return message.reply(
        "**Destek Sistemi Bu Sunucuda Zaten Kurulu Değil!**"
      );
    const data = db.get("csticket." + message.guild.id);
    db.delete(`csticket.${message.guild.id}`);
    const sunucu = client.guilds.cache.get(data.sunucuID);
    if (!sunucu) {
      db.delete("csticket." + data.sunucuID);
    } else {
      const kanal = sunucu.channels.cache.get(data.kanal);
      if (!kanal) {
        db.delete("csticket." + data.sunucuID);
      } else {
        const data2 = kanal.messages.fetch(data.mesajID);
        if (!data2) {
          db.delete("csticket." + data.sunucuID);
        } else {
          data2.then(mr => mr.delete({ timeout: 200 }));
          let a = message.guild.channels.cache.find(
            xxx => xxx.name === "DESTEK"
          );
          if (a) {
            a.delete();
          }
          message.channel.send(`**Destek Sistemi Başarıyla Kapatıldı!**`);
        }
      }
    }
  }

  if (args[0] == "aç") {
    const data = db.get("csticket." + message.guild.id);
    if (data)
      return message.reply(
        "Zaten Destek Sistemi Bu Sunucuda Açık!\nKapatmak İçin `" +
          prefix +
          "destek kapat`"
      );

    let role = message.mentions.roles.first();
    if (!role)
      return message.reply("**Bir Destek Ekibi Rolü Etiketlemen Gerek!**");

    let akanal = message.mentions.channels.first();
    if (!akanal) return message.reply("**Bir Kanal Etiketlemen Gerek!**");

    message.react("✅");

    akanal
      .send(
        new Discord.MessageEmbed()
          .setTitle(client.user.username + " Ticket Sistemi")
          .setColor("BLUE")
          .setDescription("Destek Talebi Oluşturmak İçin 📨 Emojisine Tıkla!")
          .setTimestamp()
          .setFooter("Ace Bot Destek Sistemi")
      )
      .then(async cs => {
        await cs.react("📨");
        db.set("csticket." + message.guild.id, {
          kanal: akanal.id,
          mesajID: cs.id,
          sunucuID: message.guild.id,
          rolID: role.id
        });
      });
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  aliases: ["ticket", "ticket-sistemi"]
};

exports.help = {
  name: "destek"
};
