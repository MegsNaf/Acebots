const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
module.exports.run = async (bot, message, args) => {
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

  if (message.author.id !== "bakım")
    return message.channel.send("Bu Komutu Şuanda Bakımdadır");
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!";
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    const embed = new Discord.MessageEmbed()
      .setDescription("```Ne yazık ki bu komutu kullanmaya yetkin yok.```")
      .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp()
      .setColor("RED");
    //emirhansaraç
    message.channel.send(embed);
    return;
  }

  let kanal = await db.fetch(`davetkanal_${message.guild.id}`);

  if (!kanal) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription("Davet kanalı zaten ayarlanmamış!")
        .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp()
        .setColor("RED")
    );
  }
  db.delete(`davetkanal_${message.guild.id}`);
  const emirhansarac = new Discord.MessageEmbed()
    .setColor("#0BF3B7")
    .setAuthor(`Başarılı`, message.author.avatarURL())
    .setFooter(
      `${message.author.tag} Tarafından İstendi`,
      message.author.avatarURL()
    )
    .setTimestamp()
    .setDescription(`Davet kanalı başarıyla sıfırlandı!`);
  message.channel.send(emirhansarac);
  return;
  bot.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
}; //emirhansaraç

module.exports.conf = {
  aliases: ["davetkanalsıfırla"],
  permLevel: 0,
  enabled: true,
  guildOnly: true,
  kategori: "moderasyon"
};

module.exports.help = {
  name: "davet-kanal-sıfırla",
  description: "davet-kanal-sıfırla",
  usage: "davet-kanal-sıfırla"
};
//emirhansaraç
