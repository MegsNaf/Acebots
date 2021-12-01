const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
const Ashira = new Set();
let prefix = ayarlar.prefix;

exports.run = async (client, message, args) => {
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
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
  }

  let rol = message.mentions.roles.first();
  let kanal = message.mentions.channels.first();

  if (!rol) {
    const embed2 = new Discord.MessageEmbed()
      //lrowsxrd
      .setDescription(
        "Lütfen Bir Rol Etiketle. Örnek Kullanım : **!otorol @rol #kanal**"
      )
      .setColor("RED");
    //lrowsxrd
    return message.channel.send(embed2);
  }

  if (!kanal) {
    //lrowsxrd
    const embed3 = new Discord.MessageEmbed()
      //lrowsxrd
      .setDescription(
        "Lütfen Bir Kanal Etiketle. Örnek Kullanım : **!otorol @rol #kanal**"
      )
      .setColor("RED");
    //lrowsxrd
    return message.channel.send(embed3);
  }
  //lrowsxrd
  db.set(`otorolrol_${message.guild.id}`, rol.id);
  db.set(`otorolkanal_${message.guild.id}`, kanal.id);
  //lrowsxrd
  const embed = new Discord.MessageEmbed()
    //lrowsxrd
    .setColor("GREEN")
    .setDescription(
      `Otorol Rolü **@${rol.name}** Olarak, Bildirimin Gideceği Kanal İse **#${kanal.name}** Olarak Ayarlandı.\n\n**Not: Botun Rolü Ayarladığınız Rolün Üstünde Olmaz İse Rol Vermez.**`
    );
  //lrowsxrd
  message.channel.send(embed);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
//lrowsxrd
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["oto-rol"],
  permLevel: 0
};
//lrowsxrd
exports.help = {
  name: "otorol",
  description: "lrows v12",
  usage: "otorol"
};
