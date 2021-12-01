exports.run = (client, message) => {
  let db = require("quick.db");
  let Discord = require("discord.js");
  const Ashira = new Set();
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
  let küfür = db.fetch(`küfür.${message.guild.id}.durum`);

  const member3 = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setDescription(`**HATA** - Bu Sunucuda Yetkili Değilsin.`);
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.channel.send(member3);
  const member = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setDescription(`**HATA** - Bir Kanal Etiketle.`);
  if (küfür) {
    let kanal = message.mentions.channels.first();
    if (!kanal) return message.channel.send(member);
    db.set(`küfür.${message.guild.id}.kanal`, kanal.id);
    message.channel
      .send(`**Başarılı ile küfür log kanalı ayarlandı.**`)
      .then(l => {
        l.delete({
          timeout: 5000
        });
      });
  } else {
    message.channel.send(`**Küfür engel açık değil.**`).then(l => {
      l.delete({
        timeout: 5000
      });
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
  aliases: ["küfür-log"],
  permLevel: 0
};

exports.help = {
  name: "küfürlog",
  description: "küfrü log ab",
  usage: "küfürlog"
};
