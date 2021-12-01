const Discord = require("discord.js");
const Ashira = new Set();

exports.run = async (client, message, args) => {
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
  if (Ashira.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(message.author.id);
    setTimeout(() => {
      message.delete();
      Ashira.delete(message.author.id);
    }, 10000); // milisaniye cinsinden
  }
  var aktiflik;
  const fetch = require("node-fetch");
  let ulke = message.content
    .split(" ")
    .slice(1)
    .join(" ");
  if (!ulke) return message.reply("**Bir Oyuncu Adı Girmelisin!**");

  if (
    ulke.includes(
      "ç" ||
        "Ç" ||
        "ğ" ||
        "Ğ" ||
        "İ" ||
        "ö" ||
        "Ö" ||
        "ş" ||
        "Ş" ||
        "ü" ||
        "Ü" ||
        "ı"
    )
  ) {
    return message.channel.send(
      "**Oyuncu Adları Türkçe Karakterler İçermemelidir!**"
    );
  }

  fetch(`http://api.roblox.com/users/get-by-username?username=${ulke}`)
    .then(res => res.json())
    .then(body => {
      let { Id, IsOnline } = body;

      if (body.success === false)
        return message.reply("**Böyle Bir Oyuncu Bulunamadı!**");

      if (ulke.length < 3)
        return message.reply(
          `**Oyuncu Adları En Az 3 Karakterden Oluşmalıdır!**`
        );

      if (IsOnline === false) {
        aktiflik = ":x:";
      } else {
        aktiflik = ":white_check_mark:";
      }

      fetch(`https://friends.roblox.com/v1/users/${Id}/friends/count`)
        .then(res => res.json())
        .then(body => {
          let {} = body;

          let arkadas = body.count;

          fetch(`https://users.roblox.com/v1/users/${Id}/status`)
            .then(res => res.json())
            .then(body => {
              let { status } = body;

              if (status === "") {
                status = "Durum Belirlenmemiş";
              }

              fetch(`https://friends.roblox.com/v1/users/${Id}/followers/count`)
                .then(res => res.json())
                .then(body => {
                  let { count } = body;

                  fetch(`https://users.roblox.com/v1/users/${Id}`)
                    .then(res => res.json())
                    .then(body => {
                      let { isBanned, created } = body;

                      if (isBanned === true) {
                        isBanned = "Bu Kullanıcı Yasaklı";
                      }
                      if (isBanned === false) {
                        isBanned = "Bu Kullanıcı Yasaklı Değil";
                      }

                      fetch(
                        `https://friends.roblox.com/v1/users/${Id}/followings/count`
                      )
                        .then(res => res.json())
                        .then(body => {
                          let {} = body;

                          let takipedilen = body.count;

                          var newStr = created.substring(
                            0,
                            created.length - 14
                          );
                          console.log(newStr);
                          const splituras = newStr.split("-");
                          console.log(splituras.reverse());
                          const tarih = splituras.reverse();

                          const embed = new Discord.MessageEmbed()
                            .setAuthor(
                              `${ulke} Oyuncusunun Bilgileri`,
                              `https://www.roblox.com/Thumbs/Avatar.ashx?x=420&y=420&username=${ulke}`
                            )
                            .setColor(`RANDOM`)
                            .setThumbnail(
                              `https://www.roblox.com/Thumbs/Avatar.ashx?x=420&y=420&username=${ulke}`
                            )
                            .addField(` Kullanıcı Adı`, `${ulke}`, true)
                            .addField(` ID`, `${Id}`, true)
                            .addField(` Aktiflik Durumu`, `${aktiflik}`, true)
                            .addField(` Durum`, `${status}`, true)
                            .addField(` Arkadaş Sayısı`, `${arkadas}`, true)
                            .addField(`Takipçiler`, `${count}`, true)
                            .addField(`Takip Edilen`, `${takipedilen}`, true)
                            .addField(`Yasaklı Mı?`, `${isBanned}`, true)
                            .addField(
                              `Hesap Oluşturulma Tarihi`,
                              `${tarih[2]}-${tarih[1]}-${tarih[0]}`,
                              true
                            )
                            .setFooter("Bilgiler Her Zaman Doğru Olmayabilir!");
                          message.channel.send(embed);
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
  permLevel: 0
};

exports.help = {
  name: "roblox-bilgi",
  description: "Belirttiğiniz Roblox Kullanıcısının Hesap Bilgilerini Gösterir."
};
