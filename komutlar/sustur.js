const Discord = require("discord.js");
const database = require("quick.db");
const ms = require("ms");
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
      "Önce Bir Rol Oluşturman Gerekmekte !susturma-rol "
    );

  if (!args[0])
    return message.channel.send(`\`\`\`${
      message.content.split("mute")[0]
    }sustur <kişi> <süre> <sebep>
      
Bir Kişi Gir.\nSüreler : s = saniye, m = dakika, h = saat, d = gün, w = hafta\`\`\``);

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
  if (!member) return message.channel.send(`Üye "${args[0]}" Bulunamadı`);

  let infinity = false;
  if (args[1]) {
    infinity = args.find(
      a =>
        a.endsWith("m") ||
        a.endsWith("h") ||
        a.endsWith("s") ||
        a.endsWith("d") ||
        a.endsWith("w") ||
        a.endsWith("y")
    );
  }

  var sayı = 0;
  let zaman;
  let gercek;
  args.forEach(s => {
    sayı++;
    if (s === infinity) {
      gercek = sayı;
      zaman = args[sayı - 1];
    }
  });
  args[gercek - 1] = "";
  args = args.filter(a => a !== "");

  let reason;
  if (!args[1]) reason = "Sebep: Sebep Belirtilmemiş";
  if (args[1]) reason = "Sebep: " + args.slice(1).join(" ");

  if (!zaman) {
    member.roles.add(muteRoleFetch).then(() => {
      return message.channel.send(
        `**${message.user.tag}** İsimli Kişi **${member.author.tag}** Sınırsız Şekilde Susturuldu. \`${reason}\``
      );
    });
  } else {
    let zamann = zaman
      .replace("w", " week")
      .replace("d", " day")
      .replace("s", " second")
      .replace("m", " minute")
      .replace("h", " hour");
    if (zamann.includes("second") && zamann.split(" ")[0] == 1) zamann = "now";
    if (zamann.includes("second") && zamann.split(" ")[0] > 1)
      zamann = zamann.split(" ")[0] + " seconds";
    if (zamann.includes("minute") && zamann.split(" ")[0] > 1)
      zamann = zamann.split(" ")[0] + " minutes";
    if (zamann.includes("hour") && zamann.split(" ")[0] > 1)
      zamann = zamann.split(" ")[0] + " hours";
    if (zamann.includes("day") && zamann.split(" ")[0] > 1)
      zamann = zamann.split(" ")[0] + " days";
    if (zamann.includes("week") && zamann.split(" ")[0] > 1)
      zamann = zamann.split(" ")[0] + " weeks";
    if (ms(zaman) >= 2147483647)
      return message.channel.send("En Fazla 24 Gün Susturma Atabilirsin."); // ellemeyin arkadaslar.

    member.roles.add(muteRoleFetch).then(() => {
      message.channel.send(
        `**${message.author.tag}** İsimli Yetkili **${member.user.tag}** İsimli Kişiyi Susturdu. Zaman: ${zamann}. Sebep: ${reason}`
      );
      setTimeout(() => {
        if (member.roles.has(muteRoleFetch)) {
          member.roles.remove(muteRoleFetch);
        }
      }, require("ms")(zaman));
      return;
    });
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sustur"],
  permLevel: 0
};

exports.help = {
  name: "mute"
}; // codare ♥
