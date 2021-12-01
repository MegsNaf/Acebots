const Discord = require("discord.js");
const Ashira = new Set();
const db = require("quick.db");

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

  //BYMAYFE YAPIP PAYLAŞMIŞTIR BABİ ÇALANLAR İZİN ALIRSA BENDEN PARDON İZİN ALIRSANIZ ÇALMIYORSUNUZ BENDEN İZİN ALIN HERHANGİ BİRYERDE PAYLAŞMAK İÇİN

  var guild = message.guild;
  var banlayan = message.author.tag;
  let banxx = await message.guild.fetchBans();
  if (!message.guild.me.permissions.has("BAN_MEMBERS"))
    return message.reply(
      "Kullanıcıyı Banlayamıyorum Çünkü `Üyeleri Yasakla` Yetkim Yok."
    );
  if (!message.member.hasPermission("BAN_MEMBERS"))
    if (message.author.id !== "348415047497809930")
      return message.reply(
        ":no_entry: Bu komutu kullanabilmek için `Üyeleri Yasakla` yetkisine sahip olmanız gerek."
      );

  var kisi =
    message.mentions.users.first() ||
    client.users.resolve(args[0]) ||
    client.users.cache.find(u => u.username === args[0]) ||
    client.users.cache.get(args[0]);
  if (!kisi)
    return message.reply(
      "Banlayacağım Kişiyi Belirtmen Gerekiyor `ID / @kullanici / username`"
    );
  var sebeb = args.slice(1).join(" ");

  if (message.author == kisi) return message.reply("Kendini Yasaklayamazsın!");
  if (banxx.get(kisi.id)) return message.reply(":x: Kişi Zaten Yasaklanmış!");

  var now = new Date();
  if (!sebeb) {
    try {
      kisi.send(`${kisi} **${guild}** adlı sunucudan banlandınız.`);
      message.channel.send(`**${kisi} banlandı.**`);
      guild.members.ban(kisi, { reason: sebeb /*, days: gun*/ });
    } catch (error) {
      message.reply(
        "Bir Sorun Oldu Hata : *FYC-845213** Lütfen Botun Geliştiricisi veya Yapımcısıyla İletişime Geçiniz!"
      );
      console.log(error);
    }
  } else {
    try {
      kisi.send(
        `${kisi} **${guild}** adlı sunucudan banlandınız. \nNedeni: **${sebeb}**`
      );
      message.channel.send(`**${kisi} banlandı. \nNedeni: ${sebeb}**`);
      guild.members.ban(kisi, { reason: sebeb /*, days: gun*/ });
    } catch (error) {
      message.reply(
        "Bir Sorun Oldu Hata : *FYC-845212** Lütfen Botun Geliştiricisi veya Yapımcısıyla İletişime Geçiniz!"
      );
      console.log(error);
    }
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  aliases: ["yasakla"],
  permLevel: 0
};

exports.help = {
  name: "ban",
  description: "Botun Pingini Gösterir !",
  usage: "ban"
};
