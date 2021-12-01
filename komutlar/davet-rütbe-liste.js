const Discord = require("discord.js"),
  db = require("quick.db");
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

  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!";
  let veri = await db.fetch(`rol1_${message.guild.id}`);
  let veri12 = await db.fetch(`roldavet1_${message.guild.id}`);
  let veri21 = await db.fetch(`roldavet2_${message.guild.id}`);
  let veri2 = await db.fetch(`rol2_${message.guild.id}`);

  if (!veri) {
    const embed = new Discord.MessageEmbed()
      .setDescription(`Zaten herhangi bir rütbe ayarlanmamış!`)
      .setColor("RED")
      .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp();

    message.channel.send(embed);
  }
  ///////////////////
  if (veri) {
    if (!veri2) {
      const emir23 = new Discord.MessageEmbed()
        .setDescription(
          `<@&${message.guild.roles.cache.get(veri).id}>: ${veri12} Davet!`
        )
        .setColor("#0BF3B7")
        .setAuthor(`Rütbe Liste`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();

      message.channel.send(emir23);
      return;
    } else {
      const emir = new Discord.MessageEmbed()
        .setDescription(
          `<@&${message.guild.roles.cache.get(veri).id}>: **${veri12} Davet!**
          <@&${message.guild.roles.cache.get(veri).id}>: **${veri21} Davet!**`
        )
        .setColor("#0BF3B7")
        .setAuthor(`Rank`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();

      message.channel.send(emir);
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
  aliases: ["rütbeliste"],
  permLevel: 0
};
exports.help = {
  name: "rütbe-liste",
  description: "rütbe-liste",
  usage: "rütbe-liste"
};
