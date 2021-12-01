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

  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  let hm = await db.fetch(`seviyeacik_${message.guild.id}`);
  let kanal = await db.fetch(`svlog_${message.guild.id}`);
  let xp = await db.fetch(`verilecekxp_${message.guild.id}`);
  let seviyerol = await db.fetch(`svrol_${message.guild.id}`);
  let rollvl = await db.fetch(`rollevel_${message.guild.id}`);
  let kxp = await db.fetch(`xp_${message.author.id}_${message.guild.id}`);
  let klvl = await db.fetch(`lvl_${message.author.id}_${message.guild.id}`);
  if (!hm)
    return message.channel.send(
      "Seviye komutları aktif değil! \n `!seviye-aç`"
    );
  var user = message.mentions.users.first() || message.author;

  let kontrol;
  if (klvl == null) kontrol = "0";
  else kontrol = kxp;

  let kontrol2;
  if (klvl == null) kontrol2 = "0";
  else kontrol2 = klvl;

  let seviye = new Discord.MessageEmbed()
    .setTitle("Seviye Bilgisi:")
    .setAuthor(message.member.user.username, message.author.avatarURL())
    .addField("Kullanıcı:", user, true)
    .addField("Kullanıcı XP değeri:", "**" + kontrol + "**", true)
    .addField("Kullanıcı Seviye Değeri:", "**" + kontrol2 + "**", true)
    .setFooter("Ace Bot Seviye Sistemi!")
    .setColor("RANDOM")
    .setTimestamp()
    .setThumbnail(user.avatarURL());
  message.channel.send(seviye);

  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["rank"],
  permLevel: 0
};

exports.help = {
  name: "seviye",
  description: "taslak",
  usage: "seviye"
};
