const Discord = require("discord.js");
const Ashira = new Set();
const db = require("quick.db");
exports.run = async (client, message, args) => {
  //BYMAYFE YAPIP PAYLAŞMIŞTIR BABİ ÇALANLAR İZİN ALIRSA BENDEN PARDON İZİN ALIRSANIZ ÇALMIYORSUNUZ BENDEN İZİN ALIN HERHANGİ BİRYERDE PAYLAŞMAK İÇİN
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

  var guild = message.guild;
  var banlayan = message.author.tag;
  var kisi =
    message.mentions.users.first() ||
    client.users.resolve(args[0]) ||
    client.users.cache.find(u => u.username === args[0]) ||
    client.users.cache.get(args[0]);
  if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.reply(
      ":no_entry: Bu komutu kullanabilmek için `Üyeleri Yasakla` yetkisine sahip olmanız gerek."
    );
  if (!kisi)
    return message.reply(
      "Banlayacağım Kişiyi Belirtmen Gerekiyor `ID / @kullanici / username`"
    );
  //var gun = args.slice(1).join(' ') ? `${args.slice(1).join(' ')}` :"";
  var neden = args.slice(1).join(" ");
  let banxx = await message.guild.fetchBans();

  if (!banxx.get(kisi.id)) return message.reply(":x: Kişi Yasaklanmamış");

  if (neden) {
    try {
      await message.channel.send(
        `${kisi.tag} adlı kullanıcının banı açıldı. \nNedeni: **${neden}**`
      );
      await guild.members.unban(kisi.id, neden);
    } catch (error) {
      message.reply(
        "Bir Sorun Oldu Hata : **FYC-845214** Lütfen Botun Geliştiricisi veya Yapımcısıyla İletişime Geçiniz!"
      );
      console.log(error);
    }
  } else {
    try {
      await message.channel.send(`${kisi.tag} adlı kullanıcının banı açıldı.`);
      await guild.members.unban(kisi.id, neden);
    } catch (error) {
      message.reply(
        "Bir Sorun Oldu Hata : *FYC-845215** Lütfen Botun Geliştiricisi veya Yapımcısıyla İletişime Geçiniz!"
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
  aliases: ["ban-aç"],
  permLevel: 0
};

exports.help = {
  name: "unban",
  description: "Botun Pingini Gösterir !",
  usage: "unban"
};
