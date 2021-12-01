const Discord = require("discord.js");
const database = require("quick.db");
const Ashira = new Set();
exports.run = async (client, message, args) => {
  // can#0002
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

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
  if (!args[0])
    return message.channel.send(
      "Rol Oluşturmak İçin !susturma-rol oluştur <dilerseniz bir rol ismi>."
    );

  if (args[0] === "oluştur") {
    message.guild.roles
      .create({
        data: { name: args.slice(1).join(" ") || "muted", color: "#f4424b" }
      })
      .then(role => {
        role.setPermissions(0);
        message.channel
          .send("Rol Başarılı Bir Şekilde Oluşturuldu.")
          .then(() => {
            let arrayed = message.guild.channels.cache
              .filter(a => a.type === "text")
              .array();

            var okay = 0;

            for (const key in arrayed) {
              arrayed[key].overwritePermissions(
                [
                  {
                    id: role.id,
                    deny: ["SEND_MESSAGES", "ADD_REACTIONS"]
                  }
                ],
                "Susturma Rolü Güncellendi. Güncelleyen Kişi: " +
                  message.author.tag
              );
              okay++;
            }
            database.set(`carl-mute-role.${message.guild.id}`, role.id);
            return message.channel.send(
              "Başarılı! **" +
                role.name +
                "** Rolü Oluşturuldu, Rol **" +
                okay +
                "** Adet Kanala Kapandı"
            );
          });
      });
  }

  if (!args[0] === "oluştur") {
    let role =
      message.guild.roles.cache.get(args[0]) ||
      message.mentions.roles.first() ||
      message.guild.roles.cache.find(a =>
        a.name.toLowerCase().includes(
          args
            .slice(0)
            .join(" ")
            .toLowerCase()
        )
      );
    if (!role)
      return message.channel.send(
        '"' + args.slice(0).join(" ") + '" Rolü Bulunamadı'
      );

    database.set(`carl-mute-role.${message.guild.id}`, role.id);
    return message.channel.send(
      `**${role.name}** Susturma Rolü Olarak Ayarlandı.`
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
  name: "susturma-rol"
}; // codare ♥
