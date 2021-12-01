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
  if (!message.guild.me.hasPermission("MANAGE_ROLES"))
    return message.reply("Üzgünüm ama rol vermek için geçerli yetkim yok!");
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.reply(
      `Bu komutu kullanmak için "Yönetici" Yetkisine Sahip Olmalısın!`
    );
  /*
  
  pablo pablo https://www.youtube.com/watch?v=piIroOC4it4
  youtube.com/c/EmirhanSarac
  
  */
  let prompts = [
    "Emojiye tıklandığında hangi rolü vermek istersiniz? (Etiketle)",
    "Kullanıcıların hangi emoji ile rol almasını istersiniz? (özel emojiler çalışmıyor!)",
    "Mesaj metnini yazın(varsayılan metni almak için `varsayılan` yazın)",
    "Bu mesajı hangi kanala göndermek istersiniz?(Kanalı etiketle!)"
  ];
  let roles = await getResponses(message);
  let embed = new Discord.MessageEmbed()
    .setColor("#FF5349")
    .setDescription(
      `\`Rol:\`<@&${roles.role}>\n\`Emoji:\`${roles.emoji}\n\`Yazı:\`${roles.text}\n\`Kanal\`${roles.channel}`
    );
  let msg = await message.channel.send("Onaylamak için Emojiye Basınız", embed);
  await msg.react("✅");
  await msg.react("❌");
  let filter = (reaction, user) =>
    ["✅", "❌"].includes(reaction.emoji.name) &&
    !user.bot &&
    user.id === message.author.id;
  let reactions = await msg.awaitReactions(filter, {
    max: 1,
    time: 60000,
    errors: ["time"]
  });
  let choice = reactions.get("✅") || reactions.get("❌");
  if (choice.emoji.name === "✅") {
    let emb = new Discord.MessageEmbed()
      .setColor("#FF5349")
      .setDescription(
        roles.text ||
          `<@&${roles.role}> Rolünü almak için aşağıdaki ${roles.emoji} emojisine tıklayın!`
      );
    roles.channel.send(emb).then(msg => {
      msg.react(roles.emoji);
      function random(length) {
        let string =
          "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        let secret = "";
        for (let i = length; i > 0; i--) {
          const random = Math.floor(Math.random() * string.length);
          const char = string.charAt(random);
          string = string.replace(char, "");
          secret += char;
        }
        return secret;
      }
      let string = random(24);
      roles.id = string;
      roles.msg = msg.id;
      roles.url = msg.url;
      db.set(`rolereactions_${message.guild.id}_${msg.id}`, roles);
    });
  } else if (choice.emoji.name === "❌") {
    message.channel.send("İşlem iptal edildi!");
  }
  async function getResponses(message) {
    let settings = {};
    for (let i = 0; i < prompts.length; i++) {
      let embed1 = new Discord.MessageEmbed()
        .setColor("#FF5349")
        .setDescription(prompts[i]);
      await message.channel.send(embed1);
      let response = await message.channel.awaitMessages(
        m => m.author.id === message.author.id,
        { max: 1 }
      );
      let { content } = response.first();
      if (i === 0) {
        try {
          let role =
            response.first().mentions.roles.first() ||
            message.guild.roles.cache.get(args[0]);
          settings.role = role.id;
        } catch (err) {
          throw new Error("invalid role");
          message.reply("Rol bulunamadı emoji rol oluşturma durduruldu");
        }
      } else if (i === 1) {
        let emoji = content;
        function isCustomEmoji(emoji) {
          return emoji.split(":").length == 1 ? false : true;
        }
        if (isCustomEmoji(emoji)) {
          throw new Error("invalid emoji");
          return message.reply(
            "Sanırım özel bir emoji kullandın lütfen özel emojiler kullanmayın varsayılan emojileri kullanınız!"
          );
        } else {
          settings.emoji = emoji;
        }
      } else if (i === 2) {
        if (content === "varsayılan") {
          settings.text = "";
        } else {
          settings.text = content;
        }
      } else if (i === 3) {
        let channel =
          response.first().mentions.channels.first() ||
          message.guild.channels.cache.get(r => r.name === content) ||
          message.guild.channels.cache.get(content) ||
          message.channel;
        let channel1 = message.guild.channels.cache.get(channel.id);
        let channel2 = message.guild.channels.cache.get(message.channel.id);
        if (
          !channel1
            .permissionsFor(message.author)
            .toArray()
            .includes("SEND_MESSAGES")
        ) {
          settings.channel = channel2;
        } else if (
          !channel1
            .permissionsFor(message.guild.me)
            .toArray()
            .includes("SEND_MESSAGES")
        ) {
          settings.channel = channel2;
        } else {
          settings.channel = channel1;
        }
      }
    }
    return settings;
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
module.exports.conf = {
  enabled: true,

  guildOnly: false,

  aliases: ["tepki-rol-oluştur"],

  permLevel: 0
};
module.exports.help = {
  name: "rroluştur",
  description: "Bir tepki rolü oluşturur",
  usage: " ",
  aliases: ["rradd"]
};
// youtube.com/c/EmirhanSarac
