const Ashira = new Set();
const Discord = require("discord.js");
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

  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }

  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      `Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`
    );

  let rol = message.mentions.roles.first();
  let seviye = args[1];

  let kanal = await db.fetch(`svlog_${message.guild.id}`);
  let xp = await db.fetch(`verilecekxp_${message.guild.id}`);
  let hm = await db.fetch(`seviyeacik_${message.guild.id}`);
  if (!hm)
    return message.reply(
      "Bu tuhaf! aktif edilmeyen bir seviye sistemine xp değeri eklemeyi düşünmedin umarım? \n Bunu Deniyebilirsin: `!seviye-aç`"
    );
  if (!rol)
    return message.channel.send(
      "Ayarlayabilmem için bir rol belirtmelisin. \n Örnek: `!seviye-rol @seviye10 10`"
    );
  if (!seviye)
    return message.channel.send(
      "Ayarlayabilmem için bir seviye belirtmelisin. \n Örnek: `!seviye-rol @seviye10 10`"
    );
  if (isNaN(args[1]))
    return message.channel.send(
      "seviye değerini bir sayı biçiminde girmelisin."
    );
  if (seviye > 700)
    return message.channel.send("max `700` olarak ayarlanabilir.!");

  let kontrol;
  if (kanal == null) kontrol = "Sunucuda Ayarlanmış Bir Logs Bulunamadı!";
  else kontrol = kanal;

  let kontrol2;
  if (xp == null) kontrol2 = "4 (Varsayılan)";
  else kontrol2 = xp;

  let codare = new Discord.MessageEmbed()
    .setTitle("Başarılı Ayarlandı!")
    .setDescription("Seviye rol ödülü başarıyla ayarlandı.")
    .addField("Seviye Log Kanalı:", kontrol, true)
    .addField("Mesaj Başı Verilecek XP:", kontrol2, true)
    .addField("Verilecek Rol:", rol, true)
    .addField("Rolün Verileceği Seviye:", seviye)
    .setFooter("Ace Bot Seviye Sistemi!")
    .setColor("RANDOM");
  message.channel.send(codare);
  db.set(`svrol_${message.guild.id}`, rol.id);
  db.set(`rollevel_${message.guild.id}`, seviye);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}**Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
  //Zepoo
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "seviye-rol",
  description: "taslak",
  usage: "seviye-rol"
};
