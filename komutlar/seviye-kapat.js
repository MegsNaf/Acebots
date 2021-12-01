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

  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      ` :x: Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`
    );

  if (!hm)
    return message.channel.send(
      "Seviye sistemi zaten aktif hale getirilmemiş!\n Bunu mu arıyorsun? `!seviye-aç`"
    );

  message.reply("Seviye sistemi devre dışı durumuna getiriliyor..").then(x => {
    db.delete(`seviyeacik_${message.guild.id}`);
    db.delete(`svlog_${message.guild.id}`);
    db.delete(`verilecekxp_${message.guild.id}`);
    db.delete(`svrol_${message.guild.id}`);
    db.delete(`rollevel_${message.guild.id}`);

    x.edit("sistem devre dışı bırakıldı!");
  }, 5000);

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
  name: "seviye-kapat",
  description: "taslak",
  usage: "seviye-kapat"
};
