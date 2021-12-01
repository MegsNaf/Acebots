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
  var roles = db
    .all()
    .filter(data => data.ID.startsWith(`rolereactions_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  /*
  
  youtube.com/c/EmirhanSarac
  
  */
  if (!roles.length) {
    let noEmbed = new Discord.MessageEmbed()
      .setAuthor(message.member.displayName, message.author.displayAvatarURL())
      .setColor("#FF5349")
      .setFooter("Sisteme emoji rol sistemi eklenmemiş!");
    return message.channel.send(noEmbed);
  }

  const embed = new Discord.MessageEmbed()
    .setTitle(
      `Rol reaksiyonları \`POZİSYON\` | \`ID\` | \`ROL\` | \`EMOJI\` | \`MESAJ ID\``
    )
    .setColor("#FF5349");

  let page = Math.ceil(roles.length / 10);
  let pg = parseInt(args[0]);
  if (pg != Math.floor(pg)) pg = 1;
  if (!pg) pg = 1;

  let end = pg * 10;
  let start = pg * 10 - 10;
  let array = [];
  let i;
  if (roles.length === 0) {
    embed.addField("Hata", " Sayfa bulunamadı!");
  } else if (roles.length <= start) {
    embed.addField("Hata", "Sayfa bulunamadı!");
  } else if (roles.length <= end) {
    embed.setFooter(`Sayfa ${pg} / ${page}`);

    for (i = start; i < roles.length; i++) {
      let data = roles[i].data;
      let data31 = JSON.parse(data);
      let role = message.guild.roles.cache.get(data31.role);
      let msgurl;

      array.push(
        `\`#${roles.indexOf(roles[i]) + 1}\` \`${data31.id}\` | ${role} | \`${
          data31.emoji
        }\` | [${data31.msg}](${data31.url})`
      );
      embed.setDescription(array.join("\n"));
    }
  } else {
    embed.setFooter(`Sayfa ${pg} / ${page}`);

    for (i = start; i < end; i++) {
      let data = roles[i].data;
      let data31 = JSON.parse(data);
      let role = message.guild.roles.cache.get(data31.role);
      let msgurl;

      array.push(
        `\`#${roles.indexOf(roles[i]) + 1}\` \`${data31.id}\` | ${role} | \`${
          data31.emoji
        }\` | [${data31.msg}](${data31.url})`
      );
      embed.setDescription(array.join("\n"));
    }
  }

  message.channel.send(embed);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
module.exports.conf = {
  enabled: true,

  guildOnly: false,

  aliases: ["tepki-rol-liste"],

  permLevel: 0
};
module.exports.help = {
  name: "rrlist",
  description: "Lists all reactions roles",
  usage: " <page number>",
  aliases: ["rrlist"]
};
