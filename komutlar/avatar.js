const Discord = require("discord.js");
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
  let muser = message.mentions.users.first();
  let userid;
  if (isNaN(args[0])) {
    if (!muser) {
      userid = message.author.id;
    } else {
      userid = muser.id;
    }
  } else {
    userid = args[0];
  }
  try {
    let user = await client.users.fetch(userid);
    let avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });
    if (avatar.endsWith(".gif?size=1024")) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(user.tag + "", user.displayAvatarURL())
        .setDescription(
          `**[[PNG]](${user.displayAvatarURL({
            format: "png",
            size: 1024
          })})** | **[[JPEG]](${user.displayAvatarURL({
            format: "jpeg",
            size: 1024
          })})** | **[[GIF]](${user.displayAvatarURL({
            format: "gif",
            size: 1024
          })})** | **[[WEBP]](${user.displayAvatarURL({
            format: "webp",
            size: 1024
          })})**`
        )
        .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor("RANDOM");
      message.channel.send(embed);
    } else {
      let embed = new Discord.MessageEmbed()
        .setAuthor(user.tag + "", user.displayAvatarURL())
        .setDescription(
          `**[[PNG]](${user.displayAvatarURL({
            format: "png",
            size: 1024
          })})** | **[[JPEG]](${user.displayAvatarURL({
            format: "jpeg",
            size: 1024
          })})** | **~~[GIF]~~** | **[[WEBP]](${user.displayAvatarURL({
            format: "webp",
            size: 1024
          })})**`
        )
        .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor("RANDOM");
      message.channel.send(embed);
    }
  } catch {
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription("Kullanıcıyı Bulamadım!")
    );
    return;
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
  aliases: ["av"],
  permLevel: 0
};

exports.help = {
  name: "avatar",
  description: "",
  usage: "avatar [@kullanıcı]"
};
