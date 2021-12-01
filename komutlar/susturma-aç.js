const Discord = require("discord.js");
const database = require("quick.db");
const Ashira = new Set();
exports.run = async (client, message, args) => {
  // can#0002
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

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;

  const muteRoleFetch = await database.fetch(
    `carl-mute-role.${message.guild.id}`
  );
  if (!muteRoleFetch)
    return message.channel.send(
      "Önce Bir Rol Oluşturman Gerekmekte !susturma-rol"
    );

  if (!args[0])
    return message.channel.send(`\`\`\`${
      message.content.split("unmute")[0]
    }susturma-aç <sebep>
  
Bir Kullanıcı ve Sebep Belirt.\`\`\``);

  let member =
    message.guild.members.cache.get(args[0]) ||
    message.mentions.members.first() ||
    message.guild.members.cache.find(
      a =>
        message.guild.members.cache.get(a.user.id).nickname &&
        a.nickname.toLowerCase().includes(args[0].toLowerCase())
    ) ||
    message.guild.members.cache.find(a =>
      a.user.username.toLowerCase().includes(args[0].toLowerCase())
    );
  if (!member) return message.channel.send(`"${args[0]}" Üye Bulunamadı`);
  member.roles.remove(muteRoleFetch).then(() => {
    return message.channel.send(
      "Susturma Açıldı! , Susturması Açılan Üye: **" + member.user.tag + "**"
    );
  });
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
  name: "unmute"
}; // codare ♥
