const Discord = require("discord.js");
const db = require("quick.db");
const fetch = require("node-fetch");
exports.run = async (client, message, args) => {
  const db = require("quick.db");
  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }

  let kara = db.get(`karaliste_${message.author.id}`);
  let sebep = db.get(`sebep_${message.author.id}`);
  if (message.author.bot) return;

  let blacklist = new Discord.MessageEmbed()
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp()
    .setColor("#00F611")
    .setTitle("**🎉 Erişim Kontrol\n\n> Erişiminiz Kapalı!**")
    .setDescription(`Erişiminizin Kapanmasının Nedeni: ${sebep}`);
  if (kara === true) return message.channel.send(blacklist);
  let embed9 = new Discord.MessageEmbed()
    .setColor("#00F611")
    .setDescription(
      `

         `
    )
    .setTitle(`🎉 Erişim Kontrol\n\n> Erişiminiz Açık`)
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL());
  return message.channel.send(embed9);

  client.channels.cache
    .get("877141960564035584")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["erişimkontrol"],
  permLevel: 0
};

exports.help = {
  name: "erişim-kontrol",
  description: "p",
  usage: "erişim-kontrol"
};
