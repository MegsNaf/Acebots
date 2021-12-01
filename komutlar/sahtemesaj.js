const Discord = require("discord.js");
const Ashira = new Set();
const db = require("quick.db");

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

  let kullanıcı = db.fetch(`gold_${message.author.id}`);

  if (kullanıcı == undefined) {
    message.reply("**Maalesef bu komutu kullanamazsın gold üye değilsin :(**");
  } else {
    if (kullanıcı == "gold") {
      //hamzamertakbaba#3361

      if (message.deletable) await message.delete();
      if (!message.guild.me.permissions.has("MANAGE_MESSAGES"))
        return message.channel
          .send(`${message.author} \`Webhookları Yönet\` iznim yok.`)
          .then(a => a.delete({ timeout: 4500 }));

      let ÇekilecekKullanıcı = args[0];
      if (!ÇekilecekKullanıcı)
        return message.channel
          .send(`${message.author} Bir kullanıcı ID'si girmelisin.`)
          .then(a => a.delete({ timeout: 4500 }));
      if (!Number(ÇekilecekKullanıcı))
        return message.channel
          .send(`${message.author} Kullanıcı ID'leri rakam ile yazılmalı.`)
          .then(a => a.delete({ timeout: 4500 }));

      let YazılacakMesaj = args.slice(1).join(" ");
      if (!YazılacakMesaj)
        return message.channel
          .send(`${message.author} ID'sini girdiğin kullanıcı ne yazsın?`)
          .then(a => a.delete({ timeout: 4500 }));

      if (YazılacakMesaj.includes("@everyone"))
        return message.channel
          .send(
            `${message.author} Everyone mu? Severiz, şaka şaka bir daha bunu yapma.`
          )
          .then(a => a.delete({ timeout: 4500 }));
      if (YazılacakMesaj.includes("@here"))
        return message.channel
          .send(
            `${message.author} Here mi? Severiz, şaka şaka bir daha bunu yapma.`
          )
          .then(a => a.delete({ timeout: 4500 }));

      let Kullanıcı = await client.users.fetch(ÇekilecekKullanıcı);
      try {
        message.channel
          .createWebhook(Kullanıcı.username, {
            avatar: Kullanıcı.avatarURL()
          })
          .then(async wb => {
            const Webhook = new Discord.WebhookClient(wb.id, wb.token);
            await Webhook.send(YazılacakMesaj);
            setTimeout(() => {
              Webhook.delete();
            }, 2000);
          });
      } catch (err) {
        message.channel.send(err);
      }
    }
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
  // codare ♥
  name: "sahte-mesaj"
};
