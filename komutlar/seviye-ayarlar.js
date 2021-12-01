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

  let kontrol;
  if (kanal == null) kontrol = ":x:";
  else kontrol = ":white_check_mark: | " + kanal;

  let kontrol2;
  if (xp == null) kontrol2 = "4 (Varsayılan)";
  else kontrol2 = ":white_check_mark: | " + xp;

  let kontrol3;
  if (seviyerol == null) kontrol3 = ":x:";
  else kontrol3 = ":white_check_mark: | " + seviyerol;

  let kontrol4;
  if (rollvl == null) kontrol4 = ":x:";
  else kontrol4 = ":white_check_mark: | " + rollvl;
  if (!hm)
    return message.channel.send(
      "Seviye sistemi bu sunucuda aktif durumda değil! \n Bunu mu arıyorsun? `!seviye-aç`"
    );
  let embed = new Discord.MessageEmbed()
    .setTitle("Sunucu Seviye Ayarları:")
    .setDescription(message.guild.name + " Sunucusunun seviye ayarları!")
    .addField(
      "Göstergeler",
      ":white_check_mark: : **Aktif** \n :x: : **Devre Dışı**"
    )
    .addField("Seviye Logs Kanalı:", kontrol, true)
    .addField("Mesaj Başı Verilecek XP:", kontrol2, true)
    .addField("Seviye Rol", kontrol3, true)
    .addField("Seviye Rol Leveli:", kontrol4, true);
  message.channel.send(embed);

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
  name: "seviye-ayarlar",
  description: "taslak",
  usage: "seviye-ayarlar"
};
