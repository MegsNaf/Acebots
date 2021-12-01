const Discord = require("discord.js");
const Ashira = new Set();

exports.run = async (client, message, params, args) => {
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
  const yardım = new Discord.MessageEmbed()
    .setColor(0x36393e)
    .setAuthor(`Ace Bot`, client.user.avatarURL())
    .setThumbnail(client.user.avatarURL)
    .addField(
      "**__Linkler__**",
      `Destek Sunucusu \n[TIKLA](https://discord.gg/nakvtDCRfV) \nDavet Linki \n[TIKLA](https://discord.com/oauth2/authorize?client_id=876817730664296468&scope=bot&permissions=805314622) \nSite Adresimiz \n[Geliştirme Aşamasında](https://www.acebot.ml/WebSite/Ana-Sayfa.html)`
    )
    .setFooter(
      `${message.author.username} tarafından istendi. | © Ace Bot.  `,
      message.author.avatarURL()
    );
  return message.channel.send(yardım);

  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["davet"],
  permLevel: 0
};

exports.help = {
  name: "desteksunucu",
  description: "Destek Sunucusu",
  usage: "destek"
};
