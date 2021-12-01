const Discord = require("discord.js");
const db = require("quick.db");
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
      ` Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`
    );

  let kanal = await db.fetch(`svlog_${message.guild.id}`);
  let xp = await db.fetch(`verilecekxp_${message.guild.id}`);
  let hm = await db.fetch(`seviyeacik_${message.guild.id}`);
  let seviyerol = await db.fetch(`svrol_${message.guild.id}`);
  let rollvl = await db.fetch(`rollevel_${message.guild.id}`);
  if (!hm)
    return message.reply(
      "Bu tuhaf! aktif edilmeyen bir seviye sistemine xp değeri eklemeyi düşünmedin umarım? \n Bunu Deniyebilirsin: `!seviye-aç`"
    );
  let kanals = message.mentions.channels.first();
  if (!kanals)
    return message.channel.send(
      "Kanal ayarlamam için bir kanal belirtmen gerekiyor. |n Örnek: `!seviye-kanal #level-log`"
    );

  let kontrol2;
  if (xp == null) kontrol2 = "4 (Varsayılan)";
  else kontrol2 = xp;

  let kontrol3;
  if (seviyerol == null) kontrol3 = "Seviye Rol Sistemi Aktif Değil!";
  else kontrol3 = seviyerol;

  let codare = new Discord.MessageEmbed()
    .setTitle("İşlem Başarılı!")
    .setDescription(
      "Seviye logs kanalı ayarlandı.Üyeler seviye atlayınca orda belirteceğim."
    )
    .addField("Seviye Log Kanalı:", kanals, true)
    .addField("Mesaj Başı Verilecek XP:", kontrol2, true)
    .addField("Seviye Rol:", kontrol3)
    .setFooter("Ace Bot Seviye Sistemi!")
    .setColor("RANDOM");
  message.channel.send(codare);

  message.guild.owner.send(
    "Seviye sistemi **" +
      message.member.user.username +
      "** (" +
      message.member.id +
      ") tarafından logs kanalı **" +
      kanals +
      "** Olarak ayarlandı.!\n `Seviye Sistemi`"
  );
  db.set(`svlog_${message.guild.id}`, kanals);
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "seviye-log",
  description: "taslak",
  usage: "seviye-log"
};
