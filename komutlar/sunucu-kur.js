const ms = require("ms");
const Ashira = new Set();
const Discord = require("discord.js");
exports.run = (client, message, args) => {
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

  let u = message.mentions.users.first() || message.author;

  if (
    message.guild.channels.cache.find(
      channel => channel.name === "「📃」kurallar"
    )
  )
    return message.channel.send(" Bu Sunucu Zaten Kurulu.");
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
    );
  message.channel.send(
    `Sunucu Otomatik Kurulumu Başlamak Üzeredir Bu İşlemi Onaylamak İçin **ONAYLA** Yazınız.`
  );
  message.channel
    .awaitMessages(response => response.content === "ONAYLA", {
      max: 1,
      time: 10000,
      errors: ["time"]
    })
    .then(collected => {
      message.guild.channels.create("|▬▬|ÖNEMLİ KANALLAR|▬▬|", {
        type: "category",
        reason: "Bilgi Kanalları!"
      }),
        [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ];

      message.guild.channels
        .create("「📃」kurallar", "text", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ])
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create("「🚪」gelen-giden", "text", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ])
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create("「✅」sayaç", "text", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ])
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create("「💾」log-kanalı", "text", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ])
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create("「📢」duyuru-odası", "text", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ])
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
            )
          )
        );
    })
    .then(collected => {
      message.guild.channels.create("|▬▬|GENEL KANALLAR|▬▬|", {
        type: "category",
        reason: "Bilgi Kanalları!"
      }),
        [
          {
            id: message.guild.id
          }
        ];

      message.guild.channels
        .create(`「💡」şikayet-ve-öneri`, "text")
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`「👥」pre-arama-odası`, "text")
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`「📷」görsel-içerik`, "text")
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`「🤖」bot-komutları`, "text")
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`「💬」sohbet`, "text")
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
            )
          )
        );

      message.guild.channels.create("|▬▬|SES KANALLARI|▬▬|", {
        type: "category",
        reason: "Bilgi Kanalları!"
      }),
        [
          {
            id: message.guild.id
          }
        ];

      message.guild.channels
        .create(`🏆》Kurucu Odası`, {
          type: "voice",
          reason: "Bilgi Kanalları!"
        })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
            )
          )
        )
        .then(c => {
          let role = message.guild.roles.cache.find(
            r => r.name === "@everyone"
          );
          let role2 = message.guild.roles.cache.find(r => r.name === "Kurucu");

          c.createOverwrite(role, {
            CONNECT: false
          });
          c.createOverwrite(role2, {
            CONNECT: true
          });
        });

      message.guild.channels
        .create(`🏆》Yönetici Odası`, {
          type: "voice",
          reason: "Bilgi Kanalları!"
        })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
            )
          )
        )
        .then(c => {
          let role = message.guild.roles.cache.find(
            r => r.name === "@everyone"
          );
          let role2 = message.guild.roles.cache.find(r => r.name === "Kurucu");
          let role3 = message.guild.roles.cache.find(
            r => r.name === "Yönetici"
          );
          c.createOverwrite(role, {
            CONNECT: false
          });
          c.createOverwrite(role2, {
            CONNECT: true
          });
          c.createOverwrite(role3, {
            CONNECT: true
          });
        });

      message.guild.channels
        .create(`💬》Sohbet Odası`, {
          type: "voice",
          reason: "Bilgi Kanalları!"
        })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
            )
          )
        )
        .then(c => {
          let role = message.guild.roles.cache.find(
            r => r.name === "@everyone"
          );
          c.createOverwrite(role, {
            CONNECT: true
          });
        });

      message.guild.channels.create("|▬▬|OYUN ODALARI|▬▬|", {
        type: "category",
        reason: "Bilgi Kanalları!"
      }),
        [
          {
            id: message.guild.id
          }
        ];

      message.guild.channels
        .create(`🎮》LOL`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》ZULA`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》COUNTER STRİKE`, {
          type: "voice",
          reason: "Bilgi Kanalları!"
        })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》PUBG`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》FORTNİTE`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》MİNECRAFT`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》ROBLOX`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );
      message.guild.channels
        .create(`🎮》WOLFTEAM`, { type: "voice", reason: "Bilgi Kanalları!" })
        .then(channel =>
          channel.setParent(
            message.guild.channels.cache.find(
              channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
            )
          )
        );

      message.guild.roles.create({
        data: {
          name: "Kurucu",
          color: "RED",
          permissions: ["ADMINISTRATOR"]
        },
        reason: "Kurucu Rolü"
      });

      message.guild.roles.create({
        data: {
          name: "Yönetici",
          color: "BLUE",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
          ]
        },
        reason: "Yönetici Rolü"
      });

      message.guild.roles.create({
        data: {
          name: "Moderatör",
          color: "GREEN",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
          ]
        },
        reason: "Mod Rolü"
      });

      message.guild.roles.create({
        data: {
          name: "V.I.P",
          color: "00ffff"
        },
        reason: "VIP Rolü"
      });

      message.guild.roles.create({
        data: {
          name: "Üye",
          color: "WHITE"
        },
        reason: "Üye Rolü"
      });

      message.guild.roles.create({
        data: {
          name: "Bot",
          color: "ORANGE"
        },
        reason: "Bot Rolü"
      });

      message.channel.send("Gerekli Odalar Kuruldu!");
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
  permLevel: 0
};

exports.help = {
  // codare ♥
  name: "sunucu-kur"
};
