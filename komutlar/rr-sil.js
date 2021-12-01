const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
module.exports.run = async (client, message, args) => {
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

  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.reply(
      `Bu komutu kullanmak için "Yönetici" Yetkisine Sahip Olmalısın!`
    );
  let msgid = args[0];
  if (!msgid) return message.reply("Lütfen bir mesaj ID'si belirtin!");
  /*
  
  youtube.com/c/EmirhanSarac
  
  */
  try {
    message.channel.messages
      .fetch(msgid, { limit: 1 })
      .then(m => {
        try {
          if (m.embeds.length > 0) {
            let rol31 = db.fetch(`rolereactions_${message.guild.id}_${msgid}`);
            if (!rol31)
              return message.reply(
                "Emoji rol sistemi bulunamadı lütfen oluşturduğunuzdan emin olun!"
              );
            let embed = new Discord.MessageEmbed()
              .setColor("#FF5349")
              .setDescription(
                rol31.text ||
                  `<@&${rol31.role}> Rolünü almak için aşağıdaki ${rol31.emoji} emojisine tıklayın!`
              )
              .setFooter("Bu emoji rolü silindi");
            db.delete(`rolereactions_${message.guild.id}_${msgid}`);
            m.edit({ embed });
            message.channel.send("Emoji rol sistemi veritabanından silindi!");
          } else {
            message.reply("Bilinmeyen bir hata oluştu!");
          }
        } catch (e) {
          message.reply("Bu bir emoji rolü mesajı değil lütfen kontrol edin");
        }
      })
      .catch(err => {
        message.channel.send("Mesaj bulunamadı bir hata oluştu " + err.message);
      });
  } catch (e) {
    message.reply("oof bir şeyler ters gitti " + e.message);
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
module.exports.conf = {
  enabled: true,

  guildOnly: false,

  aliases: ["tepki-rol-sil"],

  permLevel: 0
};
module.exports.help = {
  name: "tepki-rol-si",
  description: "Tepki rolünü siler",
  usage: " <emoji rolü mesaj idsi>",
  aliases: ["rrremove", "rrdelete"]
};
/*
  
  youtube.com/c/EmirhanSarac
  
  */
