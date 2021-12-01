const Discord = require("discord.js");
const data = require("quick.db");
let ayarlar = require("../ayarlar.json");
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
  ////--------------------------------------------\\\\
  let prefix = ayarlar.prefix;
  let sahip = ""; //Premium verebilicek / alabilecek kişiler
  let log = client.channels.cache.get("877561796251254794"); // logların tutulcağı kanal
  ////--------------------------------------------\\\\
  if (!args[0])
    return message.channel
      .send(`Premium sisteminden yararlanmak için bot sahibinin sizin premiumunuzu aktif etmiş olması gerekiyor.
\`${prefix}premium\` \`kontrol\``);
  ////----------------------\\\\ PREMİUM KONTROL ////----------------------\\\\
  if (message.author.id !== sahip) {
    if (args[0] === "kontrol") {
      let açıkmı = await data.fetch(`premium.${message.guild.id}`);
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setAuthor(message.guild.name, message.guild.iconURL())
          .setDescription(
            `Bu sunucu için **Premium** sistemi **${
              açıkmı ? "aktif" : "kapalı"
            }**!`
          )
          .setFooter(`Ace Bot Premium Sistemi`)
          .setTimestamp()
      );
    }
  }
  ////----------------------\\\\ PREMİUM VER ////----------------------\\\\
  if (args[0] === "ver") {
    if (message.author.id !== "723537298364301334")
      if (message.author.id !== "348415047497809930")
        if (message.author.id !== "826022851525476362")
          return message.channel.send(
            "Bu Komutu Sadece Bot Sahipleri Kullanabilir"
          );
    ////----------------------\\\\ ID Boş ise ////----------------------\\\\
    if (!args[1])
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(
            `**Lütfen Bir Sunucunun ID'sini Gir.** \n**Örnek Kullanım: !premium ver 776438002066522162**`
          )
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    let id = args[1];
    if (isNaN(id))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`**Sadece sayı girebilirsin.**`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    ////----------------------\\\\ ID Kısa İse ////----------------------\\\\
    if (id < 15)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(
            `**Girdiğin Rakam Bir Sunucunun ID'si Olmak İçin Çok Küçük.**`
          )
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    ////----------------------\\\\ ID bulunamaz ise ////----------------------\\\\
    if (!client.guilds.cache.get(id))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`\`${id}\` **sunucusunu bulamıyorum.**`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    let açıkmı = await data.fetch(`premium.${id}`);
    if (açıkmı)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`\`${id}\` **sunucusu için zaten premium aktif.**`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    ////----------------------\\\\ veritabanı ////----------------------\\\\
    data.set(`premium.${id}`, "açık");
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `${
            client.guilds.cache.get(id).name
          } isimli sunucu için **PREMİUM** aktif edildi!`
        )
        .setTimestamp()
        .setTitle(`✅ Başarılı !`)
        .setColor(`GREEN`)
    );
    ////----------------------\\\\ Sunucu sahibi mesaj ////----------------------\\\\
    let owner = client.guilds.cache.get(id).owner;
    owner.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Merhaba** \`${owner.user.username}\`**!** \`${
            message.author.tag
          }\` **isimli kişi** \`${
            client.guilds.cache.get(id).name
          }\` **isimli sunucun için premium'u açtı.**`
        )
        .setTimestamp()
        .setTitle(`🔔 Bilgilendirme !`)
        .setColor(`YELLOW`)
    );
    ////----------------------\\\\ Log kanal mesaj ////----------------------\\\\
    log.send(
      new Discord.MessageEmbed()
        .setDescription(
          `\`${message.author.tag}\` **İsimli Yetkili** \n \`${
            owner.user.username
          }\` **Adlı Kişinin Sahip Olduğu** \n \`${
            client.guilds.cache.get(id).name
          }\` **isimli sunucun için premium'u açtı.**`
        )
        .setTimestamp()
        .setTitle(`🔔 Bilgilendirme !`)
        .setColor(`YELLOW`)
    );
  }
  ////----------------------\\\\ PREMİUM AL ////----------------------\\\\
  if (args[0] === "al") {
    if (message.author.id !== "723537298364301334")
      if (message.author.id !== "348415047497809930")
        if (message.author.id !== "826022851525476362")
          return message.channel.send(
            "Bu Komutu Sadece Bot Sahipleri Kullanabilir"
          );
    ////----------------------\\\\ ID Boş ise ////----------------------\\\\
    if (!args[1])
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`Bir sunucunun ID'sini girmeyi dene.`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    let id = args[1];
    if (isNaN(id))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`Sadece sayı girebilirsin.`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    ////----------------------\\\\ ID Kısa İse ////----------------------\\\\
    if (id < 15)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(
            `Girdiğin rakam bir sunucunun ID'si olmak için çok küçük.`
          )
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    ////----------------------\\\\ ID bulunamaz ise ////----------------------\\\\
    if (!client.guilds.cache.get(id))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`**${id}** sunucusunu bulamıyorum.`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    let açıkmı = await data.fetch(`premium.${id}`);
    if (!açıkmı)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`**${id}** sunucusu için zaten premium aktif değil.`)
          .setTimestamp()
          .setTitle(`❌ Hata !`)
          .setColor(`RED`)
      );
    ////----------------------\\\\ veritabanı ////----------------------\\\\
    data.delete(`premium.${id}`);
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          `${
            client.guilds.cache.get(id).name
          } isimli sunucu için **PREMİUM** de-aktif edildi!`
        )
        .setTimestamp()
        .setTitle(`✅ Başarılı !`)
        .setColor(`GREEN`)
    );
    ////----------------------\\\\ Sunucu sahibi mesaj ////----------------------\\\\
    let owner = client.guilds.cache.get(id).owner;
    owner.send(
      new Discord.MessageEmbed()
        .setDescription(
          `**Merhaba** \`${owner.user.username}\`**!** \`${
            message.author.tag
          }\` **isimli kişi** \`${
            client.guilds.cache.get(id).name
          }\` **isimli sunucun için premium'u kapattı.**`
        )
        .setTimestamp()
        .setTitle(`🔔 Bilgilendirme !`)
        .setColor(`YELLOW`)
    );
    ////----------------------\\\\ Log kanal mesaj ////----------------------\\\\
    log.send(
      new Discord.MessageEmbed()
        .setDescription(
          `\`${message.author.tag}\` **isimli kişi** \n \`${
            owner.user.username
          }\` **Adlı Kişinin Sahip Olduğu** \n \`${
            client.guilds.cache.get(id).name
          }\` **isimli sunucun için premium'u kapattı.**`
        )
        .setTimestamp()
        .setTitle(`🔔 Bilgilendirme !`)
        .setColor(`YELLOW`)
    );
  }

  client.channels.cache
    .get("877141960564035584")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "premium"
};
