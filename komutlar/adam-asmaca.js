const { stripIndents } = require("common-tags");
const Discord = require("discord.js");
const db = require("quick.db");
let oyndurum = new Set();

module.exports.run = async (bot, message, args) => {
  if (oyndurum.has(message.author.id)) {
    return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    oyndurum.add(message.author.id);
    setTimeout(() => {
      message.delete();
      oyndurum.delete(message.author.id);
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

  let kelime = [
    "elma",
    "armut",
    "mahmut",
    "eşya",
    "sunucu",
    "ismail",
    "eşek",
    "siber",
    "kral",
    "biziz",
    "yılbaşı",
    "köpek",
    "salata",
    "biber",
    "camii",
    "maymun",
    "aslan",
    "ali",
    "bali"
  ];

  if (oyndurum.has(message.channel.id))
    return message.reply(
      "Kanal başına sadece bir adam asmaca oyunu meydana gelebilir."
    );

  try {
    const cevap = kelime[
      Math.floor(Math.random() * kelime.length)
    ].toLowerCase();
    let point = 0;
    let displayText = null;
    let tahmin = false;
    const confirmation = [];
    const yanlış = [];
    const display = new Array(cevap.length).fill("_");
    while (cevap.length !== confirmation.length && point < 6) {
      await message.channel.send(stripIndents`
                    ${
                      displayText === null
                        ? "**Ace Bot Adam Asmaca**!"
                        : displayText
                        ? "**Çok iyisin!**"
                        : "**Yanlış Harf!**"
                    }
                         **Kelime:**    \`${display.join(" ")}\`
                    **Yanlış Harfler:** ${yanlış.join(", ") || "Yok"}
                    \`\`\`
                    _________
                    |    |
                    |    ${point > 0 ? "" : ""}
                    |   ${point > 2 ? "┌" : " "}${point > 1 ? "()" : ""}${
        point > 3 ? "┐" : ""
      }
                    |    ${point > 4 ? "/" : ""} ${point > 5 ? "\\" : ""}
                    |
                    \`\`\`
                `);
      const filter = res => {
        const choice = res.content.toLowerCase();
        return (
          res.author.id === message.author.id &&
          !confirmation.includes(choice) &&
          !yanlış.includes(choice)
        );
      };
      const guess = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 300000
      });
      if (!guess.size) {
        await message.channel.send("Zamanın doldu!");
        break;
      }
      const choice = guess.first().content.toLowerCase();
      if (choice === "end") break;
      if (choice.length > 1 && choice === cevap) {
        tahmin = true;
        break;
      } else if (cevap.includes(choice)) {
        displayText = true;
        for (let i = 0; i < cevap.length; i++) {
          if (cevap.charAt(i) !== choice) continue;
          confirmation.push(cevap.charAt(i));
          display[i] = cevap.charAt(i);
        }
      } else {
        displayText = false;
        if (choice.length === 1) yanlış.push(choice);
        point++;
      }
    }
    oyndurum.delete(message.channel.id);
    if (cevap.length === confirmation.length || tahmin)
      return message.channel.send(`**Tebrikler kelimeyi buldun! **${cevap}!`);
    return message.channel.send(`Maalesef bilemedin kelime bu: **${cevap}**`);
  } catch (err) {
    oyndurum.delete(message.channel.id);
    return message.reply(`Olamaz! Bir Hata Verdi: \`${err.message}\``);
  }

  bot.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["adam-asmaca"],
  permlevel: 0
};

exports.help = {
  name: "adamasmaca",
  description: "Adam asmaca oynarsınız.",
  usage: "adamasmaca"
};
