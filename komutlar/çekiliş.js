const Discord = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const Ashira = new Set();
const db = require("quick.db");
exports.run = async (client, message) => {
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

  var time = moment().format("Do MMMM YYYY , hh:mm");
  var room;
  var title;
  var duration;
  var currentTime = new Date(),
    hours = currentTime.getHours() + 3,
    minutes = currentTime.getMinutes(),
    done = currentTime.getMinutes() + duration,
    seconds = currentTime.getSeconds();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var suffix = "AM";
  if (hours >= 12) {
    suffix = "PM";
    hours = hours - 12;
  }
  if (hours == 0) {
    hours = 12;
  }
  var filter = m => m.author.id === message.author.id;

  message.channel
    .send(
      `:eight_pointed_black_star:| **Çekilişin yapılacağı kanalın adını yaz**`
    )
    .then(msg => {
      message.channel
        .awaitMessages(filter, {
          max: 1,
          time: 20000,
          errors: ["time"]
        })
        .then(collected => {
          let room = message.guild.channels.cache.find(
            r => r.name === collected.first().content
          );
          if (!room)
            return message.channel.send(
              ":heavy_multiplication_x:| **Böyle bir kanal bulamadım**"
            );
          room = collected.first().content;
          collected.first().delete();
          msg
            .edit(
              ":eight_pointed_black_star:| **Çekilişin süresini belirle (1s, 1m, 1h, 1d, 1w)**"
            )
            .then(msg => {
              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 20000,
                  errors: ["time"]
                })
                .then(collected => {
                  if (!collected.first().content.match(/[1-60][s,m,h,d,w]/g))
                    return message.channel.send(
                      ":heavy_multiplication_x:| **Böyle bir süre bilmiyorum :(**"
                    );
                  duration = collected.first().content;
                  collected.first().delete();
                  msg
                    .edit(
                      ":eight_pointed_black_star:| **Şimdi de ödülü yaz bakalım**"
                    )
                    .then(msg => {
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 20000,
                          errors: ["time"]
                        })
                        .then(collected => {
                          title = collected.first().content;
                          collected.first().delete();
                          msg.delete();
                          message.delete();
                          try {
                            let giveEmbed = new Discord.MessageEmbed()
                              .setColor("#f558c9")
                              .setDescription(
                                `**Ödül: ${title}** \n🎉'a Basarak Katıl \nKalan Süre : ${duration} \n **Başlama Zamanı :** ${hours}:${minutes}:${seconds} ${suffix}`
                              )
                              .setFooter(
                                message.author.username +
                                  " (AceBOT çekiliş sistemi)",
                                message.author.avatarURL()
                              );
                            message.guild.channels.cache
                              .find(r => r.name === room)
                              .send(
                                " :heavy_check_mark: **ÇEKİLİŞ BAŞLADI** :heavy_check_mark:",
                                { embed: giveEmbed }
                              )
                              .then(m => {
                                let re = m.react("🎉");
                                setTimeout(() => {
                                  let users = m.reactions.cache.get("🎉").users;
                                  let list = users.cache
                                    .array()
                                    .filter(
                                      u =>
                                        (u.id !== m.author.id) !==
                                        client.user.id
                                    );
                                  let gFilter =
                                    list[
                                      Math.floor(Math.random() * list.length) +
                                        0
                                    ];
                                  let endEmbed = new Discord.MessageEmbed()
                                    .setAuthor(
                                      message.author.username,
                                      message.author.avatarURL()
                                    )
                                    .setTitle(title)
                                    .setColor("#f558c9")
                                    .setFooter("(AceBot çekiliş sistemi)")
                                    .addField(
                                      "Çekiliş Bitti !🎉",
                                      `Kazanan : ${gFilter} \nBitiş zamanı :`
                                    )
                                    .setTimestamp();
                                  m.edit("** 🎉 ÇEKİLİŞ BİTTİ 🎉**", {
                                    embed: endEmbed
                                  });

                                  var embedLel = new Discord.MessageEmbed()
                                    .setColor("#f558c9")
                                    .setDescription(
                                      "Ödülünü Moderatörleri Etiketleyerek Alabilirsin!"
                                    )
                                    .setFooter("(AceBOT çekiliş sistemi)");
                                  message.guild.channels.cache
                                    .find(r => r.name === room)
                                    .send(
                                      `**Tebrikler ${gFilter}! \`${title}\` kazandın!**`,
                                      embedLel
                                    );
                                }, ms(duration));
                              });
                          } catch (e) {
                            message.channel.send(
                              `:heavy_multiplication_x:| **Maalesef gerekli yetkilerim bulunmamakta**`
                            );
                            console.log(e);
                          }
                        });
                    });
                });
            });
        });
    });

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
  permLevel: 2
};
exports.help = {
  name: "çekiliş",
  description: "Çekiliş mi? Sunucunda güzel şeyler olacak :3",
  usage: "çekiliş"
};
