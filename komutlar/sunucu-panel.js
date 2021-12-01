const Discord = require("discord.js");
const db = require("quick.db");
const Ashira = new Set();

exports.run = async function(client, msg, args) {
  const db = require("quick.db");
  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(msg.author.id)) {
      return msg.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  let karaliste = db.get(`karaliste_${msg.author.id}`);
  if (karaliste === true)
    return msg.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Erişiminiz Engellendi")
        .setDescription(
          `**Erişiminizin Neden Engellendiğini Öğrenmek İçin [Ace Bot Destek](https://discord.gg/nakvtDCRfV) Sunucusuna Gelip \`MegsNaf yada Rigby Reis\` İle İletişime Geçiniz.**`
        )
        .setTimestamp()
        .setColor("RED")
        .setImage("https://i.hizliresim.com/b3jbgkl.png")
        .setThumbnail(msg.author.avatarURL())
    );
  if (Ashira.has(msg.author.id)) {
    return msg.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
  } else {
    Ashira.add(msg.author.id);
    setTimeout(() => {
      msg.delete();
      Ashira.delete(msg.author.id);
    }, 10000); // milisaniye cinsinden
  }

  let ayar = args[0];
  if (!ayar) {
    return msg.reply("lütfen `aç` ya da `kapat` şeklinde bir ayar giriniz.");
  } else if (ayar == "aç") {
    let sistem = await db.fetch(`panell_${msg.guild.id}`);
    if (sistem || sistem == "açık") {
      msg.reply("sistem zaten açık durumda!");
    } else {
      db.set(`panell_${msg.guild.id}`, "açık");
      msg.reply("sistem açık hâle getirildi!");
    }
  } else if (ayar == "kapat") {
    let sistem = await db.fetch(`panell_${msg.guild.id}`);
    if (!sistem) {
      msg.reply("sistem zaten kapalı durumda!");
    } else {
      let panelID = db.fetch(`panelParentID_${msg.guild.id}`);
      let ch = client.channels.cache.get(panelID);
      if (!ch) {
        let kanal = msg.guild.channels.cache.find(c =>
          c.name.startsWith(msg.guild.name)
        );
        if (!kanal) {
        } else {
          try {
            kanal.delete();
          } catch (e) {
            msg.channel.send("Bir hata var.");
          }
        }
      } else {
      }
      ch.delete();
      db.delete(`panelParentID_${msg.guild.id}`);
      db.delete(`panell_${msg.guild.id}`);
      msg.reply("sistem kapalı hâle getirildi!");
      let toplamID = db.fetch(`toplamID_${msg.guild.id}`);
      let kanal = client.channels.cache.get(toplamID);
      if (!kanal) {
      } else {
        kanal.delete();
        db.delete(`toplamID_${msg.guild.id}`);
      }
      let uyeID = db.fetch(`uyeSayıID_${msg.guild.id}`);
      let s = client.channels.cache.get(uyeID);
      if (!s) {
      }
      s.delete();
      db.delete(`uyeSayıID_${msg.guild.id}`);
      let botID = db.fetch(`botSayıID_${msg.guild.id}`);
      let bb = client.channels.cache.get(botID);
      if (!bb) {
      }
      bb.delete();
      db.delete(`botSayıID_${msg.guild.id}`);
      let idd = db.fetch(`onlSayıID_${msg.guild.id}`);
      let idD = client.channels.cache.get(idd);
      console.log(idD.id);
      idD.delete();
      db.delete(`onlSayıID_${msg.guild.id}`);
      let sdd = db.fetch(`sesliID_${msg.guild.id}`);
      let kanalle = client.channels.cache.get(sdd);
      if (!kanalle) {
      }
      kanalle.delete();
      db.delete(`sesliID_${msg.guild.id}`);
      let sys = await db.fetch(`panell_${msg.guild.id}`);
      if (sys == "açık") {
        try {
          db.delete(`panell_${msg.guild.id}`);
        } catch (e) {}
      }
    }
  }

  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${msg.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "panel",
  description: "Tüm komutları gösterir.",
  usage: "panel"
};
