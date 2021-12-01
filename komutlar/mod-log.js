const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();
//lrowsxrd
exports.run = async (client, message, args) => {
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

  //lrowsxrd
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      `Bu Komutu Kullanabilmek İçin "\`Yönetici\`" Yetkisine Sahip Olmalısın.`
    );
  //lrowsxrd
  let logk = message.mentions.channels.first();
  let logkanal = await db.fetch(`codeminglog_${message.guild.id}`);
  //lrowsxrd
  if (args[0] === "sıfırla" || args[0] === "kapat") {
    //lrowsxrd
    if (!logkanal)
      return message.channel.send(
        new Discord.MessageEmbed()
          //lrowsxrd
          .setDescription(`Mod-Log kanalı zaten ayarlı değil!`)
          .setColor("RED")
      );
    //lrowsxrd
    db.delete(`codeminglog_${message.guild.id}`);
    //lrowsxrd
    message.channel.send(
      new Discord.MessageEmbed()
        //lrowsxrd
        .setDescription(`Mod-Log Kanalı başarıyla sıfırlandı.`)
        .setColor("GREEN")
    );
    //lrowsxrd
    return;
  }
  //lrowsxrd
  if (!logk)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`Mod-Log kanalı belirt!`)
        .setColor("RED")
    );
  //lrowsxrd
  //lrowsxrd
  db.set(`codeminglog_${message.guild.id}`, logk.id);
  //lrowsxrd
  message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(`Mod-Log kanalı başarıyla ${logk} olarak ayarlandı.`)
      .setColor("GREEN")
  );

  console.log(
    `Mod-log komutu ${message.author.username} Tarafından kullanıldı`
  );
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
//lrowsxrd
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["mod-log"],
  permLevel: 0
};
//lrowsxrd
exports.help = {
  name: "modlog",
  description: "lrowsv12",
  usage: "modlog"
};
