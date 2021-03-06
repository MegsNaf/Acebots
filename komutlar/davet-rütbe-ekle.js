const Discord = require("discord.js"),
  db = require("quick.db");
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

  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send("Yönetici yetkisine sahip olmalısınız!");
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!";
  let veri = await db.fetch(`rol1_${message.guild.id}`);
  let veri2 = await db.fetch(`rol2_${message.guild.id}`);
  let veri12 = await db.fetch(`roldavet1_${message.guild.id}`);
  if (veri2) {
    const embed = new Discord.MessageEmbed()
      .setDescription(`Zaten maksimum rütbe sınırına ulaşmışsınız!`)
      .setColor("RED")
      .setFooter(client.user.username, client.user.avatarURL());

    message.channel.send(embed);
    return;
  }
  if (!veri) {
    let enis = args[1];
    let sine = message.mentions.roles.first();
    if (!sine) {
      const embed = new Discord.MessageEmbed()
        .setDescription(
          `Lütfen bir rol etiketleyiniz!\nÖrnek: !rütbe-ekle @Rol 5`
        )
        .setColor("RED")
        .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();

      message.channel.send(embed);
      return;
    }
    if (!enis) {
      const embed = new Discord.MessageEmbed()
        .setDescription(
          `Lütfen bir davet sayısı belirtiniz!\nÖrnek: !rütbe-ekle @Rol 5`
        )
        .setColor("RED")
        .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();

      message.channel.send(embed);
      return;
    }
    const embed = new Discord.MessageEmbed()
      .setDescription(
        `Başarılı bir şekilde ${sine} rolü ${enis} davet karşılığında elde edilebilecek!`
      )
      .setColor("#0BF3B7")
      .setAuthor(`Başarılı`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp();

    message.channel.send(embed);
    await db.set(`rol1_${message.guild.id}`, sine.id);
    await db.set(`roldavet1_${message.guild.id}`, enis);
    return;
  }
  ///////////////////
  else {
    let enis = args[1];
    let sine = message.mentions.roles.first();
    if (!sine) {
      const embed = new Discord.MessageEmbed()
        .setDescription(
          `Lütfen bir rol etiketleyiniz!\nÖrnek: !rütbe-ekle @Rol 5`
        ) //BUMBEGABRAK
        .setColor("RED")
        .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();

      message.channel.send(embed);
      return;
    }
    if (!enis) {
      const emir = new Discord.MessageEmbed()
        .setDescription(
          `Lütfen bir davet sayısı belirtiniz!\nÖrnek: !rütbe-ekle @Rol 5`
        )
        .setColor("RED")
        .setAuthor(`Hatalı Giriş`, message.author.avatarURL())
        .setFooter(
          `${message.author.tag} Tarafından İstendi`,
          message.author.avatarURL()
        )
        .setTimestamp();

      message.channel.send(emir);
      return;
    } //BUMBEGABRAK
    const hayda = new Discord.MessageEmbed()
      .setDescription(
        `Başarılı bir şekilde ${sine} rolü ${enis} davet karşılığında elde edilebilecek!`
      )
      .setColor("#0BF3B7")
      .setAuthor(`Başarılı`, message.author.avatarURL())
      .setFooter(
        `${message.author.tag} Tarafından İstendi`,
        message.author.avatarURL()
      )
      .setTimestamp();
    //BUMBEGABRAK
    message.channel.send(hayda);
    if (enis < veri12) {
      let hhh = await db.fetch(`rol1_${message.guild.id}`);
      let sss = await db.fetch(`roldavet1_${message.guild.id}`);
      await db.set(`rol1_${message.guild.id}`, sine.id);
      await db.set(`roldavet1_${message.guild.id}`, enis);
      await db.set(`rol2_${message.guild.id}`, hhh);
      await db.set(`roldavet2_${message.guild.id}`, sss);

      return;
    } else {
      await db.set(`rol2_${message.guild.id}`, sine.id);
      await db.set(`roldavet2_${message.guild.id}`, enis);
      return;
    }
  }
  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
}; //BUMBEGABRAK
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["rütbeekle"],
  permLevel: 0
};
exports.help = {
  name: "rütbe-ekle",
  description: "rütbe-ekle",
  usage: "rütbe-ekle"
};
