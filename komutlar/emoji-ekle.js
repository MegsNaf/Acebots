const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
const { MessageEmbed } = require("discord.js");
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

  if (!message.member.hasPermission("MANAGE_EMOJIS")) {
    return message.channel.send(`Gerekli iznin yok! (Emojileri yönet)`);
  }

  const emoji = args[0];

  if (!emoji) return message.channel.send(`Bir emoji girmelisin!`);

  let customemoji = Discord.Util.parseEmoji(emoji);

  if (customemoji.id) {
    const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
      customemoji.animated ? "gif" : "png"
    }`;

    const name = args.slice(1).join(" ");

    message.guild.emojis
      .create(
        `${Link}`,

        `${name || `${customemoji.name}`}`
      )
      .catch(error => {
        console.log(error);
      });

    const Added = new MessageEmbed()

      .setTitle(`Başarılı`)

      .setColor("RANDOM")

      .setDescription(
        `**Emoji eklendi!** | **İsim:** \`${name ||
          `${customemoji.name}`}\` | **Ön İzleme:** [Bana Tıkla](${Link})`
      );

    return message.channel.send(Added).catch(e => {
      console.log(e);
    });
  } else {
    let CheckEmoji = parse(emoji, {
      assetType: "png"
    });

    if (!CheckEmoji[0])
      return message.channel.send(`Lütfen geçerli bir emoji girin!`);

    message.channel.send(`Normal emojileri sunucunuza ekleyemezsiniz!`);
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  aliases: ["emoji-yükle"]
};

exports.help = {
  name: "emoji-ekle",
  description: "Başka sunucudan kullandığınız emojiyi sunucuya ekler",
  usage: "emojiyükle <özel emoji>"
};
