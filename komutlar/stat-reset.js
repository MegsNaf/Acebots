const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
const Ashira = new Set();
// exports.onLoad = (client) => {};
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} args
 */
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
  if (
    !message.member.permissions.has("ADMINISTRATOR") &&
    !message.member.permissions.has("MANAGE_GUILD")
  )
    return message.reply("Bunu Yapmak İçin Yetkin Yetersiz");
  let deleteMessages = [];

  let msg = await message.reply(
    "Neyi Sıfırlıcaksın `(herşey, ses ve mesaj)` Lütfen Birini Yaz"
  );
  deleteMessages.push(msg);

  let reply = await message.channel
    .awaitMessages(m => m.author.id == message.author.id, {
      time: 15000,
      max: 1
    })
    .then(messages => messages.first())
    .catch(err => undefined);
  if (!reply) {
    message.reply("15 Saniyen Doldu Lütfen Komutu Tekrar Yazın.");
    return delete_Messages(deleteMessages);
  }
  deleteMessages.push(reply);

  if (
    !["herşey", "ses", "mesaj"].some(
      type => reply.content.toLowerCase() == type
    )
  )
    return delete_Messages(deleteMessages);

  switch (reply.content) {
    case "herşey":
      vt.set(`stats.${message.guild.id}`, {});
      mdb.set(`stats.${message.guild.id}`, {});
      break;
    case "ses":
      vt.set(`stats.${message.guild.id}`, {});
      break;
    case "mesaj":
      mdb.set(`stats.${message.guild.id}`, {});
      break;
    default:
      vt.set(`stats.${message.guild.id}`, {});
      mdb.set(`stats.${message.guild.id}`, {});
      break;
  }
  delete_Messages(deleteMessages);
  message
    .reply(`\`${reply.content}\` Bilgilerin Başarıyla Sıfırlandı.`)
    .then(m => m.delete({ timeout: 5000 }));
  function delete_Messages(messages) {
    messages.forEach(message => {
      if (message.deletable && !message.deleted) message.delete().catch();
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
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "ist-sıfırla",
  description: "Sihirli 8ball sorularınızı cevaplar",
  usage: "soru <soru>"
};
