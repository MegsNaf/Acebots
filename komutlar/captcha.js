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

  let açıkmı = await db.fetch(`premium.${message.guild.id}`);
  if (açıkmı) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("Yönetici Yetkisine Sahip Olmalısınız!");

    let filtre = mes => mes.author.id === message.author.id;
    message.channel
      .awaitMessages(filtre, {
        max: 1,
        time: 35000,
        errors: ["time"]
      })
      .then(collected => {
        let adım1 = new Discord.MessageEmbed()
          .setTitle("Adım 1")
          .setDescription(
            "İlk önce eğer kullanıcılar kodu doğru bir şekilde bilirse verilecek rolü belirlemen gerekiyor."
          )
          .addField("Örnek:", "**@rol** `/` **685770403146367007 (Rol ID)**")
          .addField(
            "Devam!",
            "Devam etmek için bulunduğunuz kanala yukardaki örnek gibi bir rol belirtin."
          )
          .setFooter("Ace Bot Captcha Sistemi", client.user.avatarURL())
          .setTimestamp()
          .setURL("https://discord.gg/nakvtDCRfV")
          .setColor("RED");
        message.channel.send(adım1).then(l => {
          message.channel
            .awaitMessages(filtre, {
              max: 1,
              time: 50000,
              errors: ["time"]
            })
            .then(collected => {
              let rol =
                collected.first().mentions.roles.first() ||
                message.guild.roles.cache.get(collected.first().content);
              if (!rol) {
                l.delete();
                collected.first().react("❌");
                message.channel
                  .send("Belirttiğiniz rolü sunucuda bulamadım.")
                  .then(t => t.delete(10000));
                return;
              }
              let adim = new Discord.MessageEmbed()
                .setTitle("Adım 2")
                .setDescription(
                  "Kullanıcı kayıt olunca loga yansıtılacak bir kanal belirlemeniz gerekiyor."
                )
                .addField(
                  "Örnek:",
                  "**#log** `/` **685770403146367007 (Kanal ID)**"
                )
                .addField(
                  "Devam!",
                  "Devam etmek için bulunduğunuz kanala yukardaki örnek gibi bir kanal belirtin."
                )
                .setFooter("Ace Bot Captcha Sistemi", client.user.avatarURL())
                .setTimestamp()
                .setURL("https://discord.gg/nakvtDCRfV")
                .setColor("RED");
              message.channel.send(adim).then(l => {
                message.channel
                  .awaitMessages(filtre, {
                    max: 1,
                    time: 50000,
                    errors: ["time"]
                  }) //EMİRHAN SARAÇ

                  .then(collected => {
                    let kanal =
                      collected.first().mentions.channels.first() ||
                      message.guild.channels.cache.get(
                        collected.first().content
                      );
                    if (!kanal) {
                      l.delete();
                      collected.first().react("❌");
                      message.channel
                        .send("Belirttiğiniz kanalı sunucuda bulamadım.")
                        .then(t => t.delete(10000));
                      return;
                    }
                    let adım2 = new Discord.MessageEmbed()
                      .setTitle("Adım 3")
                      .setDescription(
                        "Zorluk seviyesini seçmemiz gerekmektedir."
                      )
                      .addField(
                        "Zorluk Seviyeleri:",
                        "» kolay \n » orta \n » zor"
                      )
                      .addField(
                        "Devam!",
                        "Devam etmek için bulunduğunuz kanala yukardaki zorluklardan bir tanesini belirtin."
                      )
                      .setFooter(
                        "Ace Bot Captcha Sistemi",
                        client.user.avatarURL()
                      )
                      .setTimestamp()
                      .setURL("https://discord.gg/nakvtDCRfV")
                      .setColor("RED");
                    message.channel.send(adım2).then(ü => {
                      message.channel
                        .awaitMessages(filtre, {
                          max: 1,
                          time: 50000,
                          errors: ["time"]
                        }) //EMİRHAN SARAÇ

                        .then(collected => {
                          let zorluk;
                          if (collected.first().content === "kolay")
                            zorluk = "kolay";
                          if (collected.first().content === "orta")
                            zorluk = "orta";
                          if (collected.first().content === "zor")
                            zorluk = "zor";
                          if (!zorluk) {
                            ü.delete;
                            message.reply(
                              "Geçerli bir kolaylık seviyesi girmediniz."
                            );
                            return;
                          }
                          //EMİRHAN SARAÇ

                          let adım3 = new Discord.MessageEmbed()
                            .setTitle("Sistem Aktifleştirildi!")
                            .setDescription("Captcha Sistemini Aktif Ettiniz!")
                            .addField(
                              "Sistem",
                              "Verilecek Rol **»** <@&" +
                                rol.id +
                                "> \n\n Zorluk Derecesi **»** `" +
                                zorluk +
                                "` \n\n Log Kanalı **»** " +
                                kanal +
                                ""
                            )
                            .setFooter(
                              "Ace Bot Captcha Sistemi",
                              client.user.avatarURL()
                            )
                            .setTimestamp()
                            .setURL("https://discord.gg/nakvtDCRfV")
                            .setColor("BLUE");
                          message.channel.send(adım3);
                          //EMİRHAN SARAÇ

                          db.set(`captchazorluk.${message.guild.id}`, zorluk);
                          db.set(`captcharol.${message.guild.id}`, rol.id);
                          db.set(`captchaKanal.${message.guild.id}`, kanal.id);
                        });
                    });
                  }, 20000);
              });
            });
        });

        //EMİRHAN SARAÇ
      });
  } else {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `${message.author}, bu komut premium bir komuttur. Bu sunucu da premium bulunmamakta.`
        )
        .setFooter(``)
        .setTimestamp()
        .setTitle(`🔔 Bilgilendirme !`)
        .setColor(`YELLOW`)
    );
  }

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
  name: "captcha",
  description: "taslak",
  usage: "captcha"
};
