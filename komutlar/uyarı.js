const Discord = require("discord.js");
const ms = require("ms");
const data = require("quick.db");
const moment = require("moment");
const Ashira = new Set();
moment.locale("tr");

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
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send("Mesajları Yetkisine Sahip Olmalısınız!");

  if (!args[0])
    return message.channel.send(`\`\`\`!uyar  [sebep]
          ^^^^^^^^
Bir kişi belirtmen gerekiyor.\`\`\``);

  let user =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]) ||
    message.guild.members.cache.find(user =>
      user.user.username.toLowerCase().includes(args[0].toLowerCase())
    );
  if (!user)
    return message.channel.send(`"${args[0]}" bu sunucuda bulunamadı.`);

  let reason;
  if (!args[1]) {
    reason = "";
  } else {
    reason = ` Sebep: ${args[1]}`;
  }

  await data.add(`sayı.${message.guild.id}.${user.id}`, 1);
  if (typeof (await data.fetch(`case.${message.guild.id}`)) != "number")
    await data.set(`case.${message.guild.id}`, 0);
  await data.add(`case.${message.guild.id}`, 1);

  const l = await data.fetch(`sayı.${message.guild.id}.${user.id}`);

  if (l === 3) {
    let role = message.guild.roles.cache.find(
      role => role.name === "Susturuldu"
    );
    if (!role)
      message.guild.roles.create({ data: { name: "Susturuldu" } }).then(rol => {
        role = rol;
      });
    message.guild.member(user).roles.add(role);
    setTimeout(() => {
      message.guild.member(user).roles.remove(role);
    }, 1 * 1000 * 60 * 60); //deneyelim
  }

  const casee = await data.fetch(`case.${message.guild.id}`);
  var tarih = new Date(Date.now());
  console.log(tarih);
  if (!data.get(`bilgi.${message.guild.id}.${user.id}`) instanceof Array)
    data.set(`bilgi.${message.guild.id}.${user.id}`, []); //push yaptığımızdan dolayı array olduğundan emin olmalıyız

  data.push(`bilgi.${message.guild.id}.${user.id}`, {
    moderator: message.author.tag,
    case: "#" + casee.toString() ? "#" + casee.toString() : "#0",
    tarih: moment().format("DD-MM-YYYY"),
    reason: reason ? reason : "Sebep: N/A"
  });
  user.send(
    `\`${message.guild.name}\` Sunucusunda Uyarıldınız. **Sebep** : ${
      reason.replace("Sebep: ", "") ? reason.replace("Sebep: ", "") : "N/A"
    } **Moderatör** : ${message.author.tag} **Kullanıcı ID**: ${
      message.author.id
    }`
  );
  message.channel.send(
    `**${
      user.tag ? user.tag : user.user.tag
    }** İsimli Kullanıcı Uyarıldı, Bu Onun ${l ? l : "0"}. Uyarısı. \`${
      reason ? reason : ""
    }\``
  );
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["uyar"],
  permLevel: 0
};

exports.help = {
  name: "warn"
}; // codare ♥
