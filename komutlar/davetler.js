const Discord = require("discord.js"),
  db = require("quick.db");
const Ashira = new Set();
exports.run = async (client, message, args, tools) => {
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

  let kişi;
  if (message.mentions.members.first()) {
    kişi = message.mentions.members.first();
  } else {
    kişi = message.author;
  }

  let bilgi = await db.fetch(`davet_${kişi.id}_${message.guild.id}`);
  let sayı2;
  if (!bilgi) {
    sayı2 = 0;
  } else {
    sayı2 = await db.fetch(`davet_${kişi.id}_${message.guild.id}`);
  }
  let veri = await db.fetch(`rol1_${message.guild.id}`);
  let veri12 = await db.fetch(`roldavet1_${message.guild.id}`);
  let veri21 = await db.fetch(`roldavet2_${message.guild.id}`);
  let veri2 = await db.fetch(`rol2_${message.guild.id}`);
  if (!veri) {
    const embed = new Discord.MessageEmbed()
      .addField(`Davetlerin Sahibi`, `<@` + kişi.id + `>`, true)
      .addField(`Toplam Davet:`, sayı2, true)
      .setColor("#0BF3B7")
      .setAuthor(`Davet İstatistik`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp();
    message.channel.send(embed);
  }
  if (message.member.roles.cache.has(veri2)) {
    const embed = new Discord.MessageEmbed()
      .addField(`Davetlerin Sahibi`, `<@` + kişi.id + `>`, true)
      .addField(`Toplam Davet:`, sayı2, true)
      .setColor("#0BF3B7")
      .setAuthor(`Davet İstatistik`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp();
    message.channel.send(embed);
    return;
  }
  if (!message.member.roles.cache.has(veri)) {
    const embed = new Discord.MessageEmbed()
      .addField(`Davetlerin Sahibi`, `<@` + kişi.id + `>`, true)
      .addField(`Toplam Davet:`, sayı2, true)
      .setColor("#0BF3B7")
      .setDescription(
        `${message.guild.roles.cache.get(veri).name} rolü için son ${-sayı2 -
          -veri12} davet!`
      )
      .setAuthor(`Davet İstatistik`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp();
    message.channel.send(embed);
    return;
  }
  if (message.member.roles.cache.has(veri)) {
    if (!veri2) {
      const emirhansarac1 = new Discord.MessageEmbed()
        .addField(`Davetlerin Sahibi`, `<@` + kişi.id + `>`, true)
        .addField(`Toplam Davet:`, sayı2, true)
        .setColor("#0BF3B7")
        .setAuthor(`Davet İstatistik`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();
      message.channel.send(emirhansarac1);
      return;
    }
    if (veri2) {
      const emirhansarac = new Discord.MessageEmbed()
        .addField(`Davetlerin Sahibi`, `<@` + kişi.id + `>`, true)
        .addField(`Toplam Davet:`, sayı2, true)
        .setColor("#0BF3B7")
        .setDescription(
          `${message.guild.roles.cache.get(veri2).name} rolü için son ${-sayı2 -
            -veri21} davet!`
        )
        .setAuthor(`Davet İstatistik`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();
      message.channel.send(emirhansarac);
      return;
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
  guildOnly: true,
  aliases: ["davetle", "davetlerim"],
  permLevel: 0
};

exports.help = {
  name: "davetler"
};
