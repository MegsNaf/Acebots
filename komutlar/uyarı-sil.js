const Discord = require("discord.js");
const data = require("quick.db");
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

  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send("Mesajları Yetkisine Sahip Olmalısınız!");
  let user =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]) ||
    message.guild.members.cache.find(user =>
      user.user.username.toLowerCase().includes(args[0].toLowerCase())
    );
  if (!user)
    return message.channel.send(`"${args[0]}" bu sunucuda bulunamadı.`);

  const sayı = await data.fetch(`sayı.${message.guild.id}.${user.id}`);
  if (!sayı) return message.channel.send(`Bu üyenin hiç bir uyarısı yok.`);

  const bilgi = await data.fetch(`bilgi.${message.guild.id}.${user.id}`);

  message.channel.send(`**${user.tag}** İsimi Üyenin ${sayı} Uyarısı Silindi.`);
  await data.delete(`sayı.${message.guild.id}.${user.id}`);
  await data.delete(`bilgi.${message.guild.id}.${user.id}`);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["uyarı-temizle"],
  permLevel: 0
};

exports.help = {
  name: "clearwarn"
}; // codare ♥
