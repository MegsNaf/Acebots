const Discord = require("discord.js");
const db = require("quick.db");
var kelimeler = [
  "https://i.hizliresim.com/7le4mug.png",
  "https://i.hizliresim.com/6fb4t7g.png",
  "https://i.hizliresim.com/ga5p71t.png"
];
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

  if (!args[0])
    return message.channel.send(
      "Kiminle yazan kazanır oynamak istiyorsan o kişiyi etiketle."
    );
  if (!message.mentions.members.first())
    return message.channel.send("Hata: Etiketlenen kişi bulunamadı.");
  const member = message.mentions.members.first();
  if (member.user.id === message.author.id)
    return message.channel.send(
      "Hata: Sadece kendiniz dışında bir kişiyle oynayabilirsiniz."
    );

  message.channel
    .send(
      `${member}, sana bir yazan kazanır daveti yollandı. Kabul etmek istiyorsan aşşağıda ki 🟢 tepkisine, reddetmek için 🔴 tepkisine tıkla.`
    )
    .then(async sent => {
      await sent.react("🟢");
      await sent.react("🔴");

      const filter = (reaction, user) => user.id === member.id;
      sent
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then(collected => {
          collected = collected.first();
          if (collected._emoji.name === "🔴")
            return (
              sent.delete() && message.reply("Yazan kazanır kabul edilmedi.")
            );
          sent.delete();
          message.channel.send("Kelime hazırlanıyor, bekleyin!").then(sent2 => {
            setTimeout(() => {
              const kelime = random(kelimeler);
              const mf = response => {
                return response.content.toLowerCase(
                  "RÖPTEŞAMBIR",
                  "STETESKOP",
                  "NÖROŞİRURJİ"
                );
              };
              const embed = new Discord.MessageEmbed()
                .setDescription(`${member} ${message.author}, kelimeniz:`)
                .setImage(`${kelime}`);
              message.channel.send(embed);
              message.channel
                .awaitMessages(mf, { max: 1, time: 30000, errors: ["time"] })
                .then(answer => {
                  sent2.delete();

                  return message.channel
                    .send(`${answer.first().author} doğru cevabı verdi!`)
                    .then(m => m.delete({ timeout: 20000 }));
                })
                .catch(() => message.channel.send("Sanırım kimse kazanamadı."));
            }, 3000);
          });
        })
        .catch(
          error => console.log(error) && message.reply("Bir cevap verilmedi.")
        );
    });

  function random(map) {
    if (!map) return;
    return map[Math.floor(Math.random() * map.length)];
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
  aliases: ["yazankazanır"],
  permLevel: 0
};

exports.help = {
  name: "yazan-kazanır"
}; // codare ♥
