const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let pages = [
    "**Moderasyon Komutları**\n\n\n> `!panel -> Sunucu Panelini Açar/Kapatır.`\n\n> `!temizle -> Belirlediğiniz Miktarda Mesajı Siler.`\n\n> `!çekiliş -> Çekiliş Yapmanızı Sağlar.`\n\n> `!captcha-yardım -> Captcha Sistemi Hakkında Bilgi Almanızı Sağlar (Sadece Premium Sunucular).`\n\n> `!emoji-ekle -> Gönderdiğiniz Emojiyi Sunucuya Ekler.`",
    "**Moderasyon Komutları**\n\n\n> `!sunucu-kur -> Hazır Basit Bir Sunucu Kurmanızı Sağlar.`\n\n> `!sa-as aç/kapat -> Selam Sistemini Açar/Kapatır.`\n\n> `!kanal-sıfırla -> Sunucuda Mesaj Yazılmış Kanalları Silip Tekrar Oluşturur.`\n\n> `!uyar -> Etiketlediğiniz Kullanıcıya Girdiğiniz Sebep İle Uyarı Eklersiniz.`\n\n> `!uyarılar -> Etiketlediğiniz Kişinin Uyarılarına Bakarsınız.`",
    "**Moderasyon Komutları**\n\n\n> `!uyarı-temizle -> Etiketlediğiniz Kullanıcının Tüm Uyarılarını Temizlersiniz.`\n\n> `!sustur -> Etiketlediğiniz Kişiyi Susturur.`\n\n> `!susturma-rol -> Susturulmuş Rolü Oluşturmanıza Yardımcı Olur.`\n\n> `!susturma-aç -> Etiketlediğiniz Kişinin Susturmasını Kaldırır.`\n\n> `!ban -> Etiketlediğiniz Kişiyi Sunucudan Yasaklar.`",
    "**Moderasyon Komutları**\n\n\n> `!ban-aç -> Etiketlediğiniz Kişinin Yasağını Kaldırır.`\n\n> `!giriş-çıkış-ayarla -> Etiketlediğiniz Kanala Giriş Çıkış Sistemini Ayarlar.`\n\n> `!giriş-çıkış-sıfırla -> Giriş Çıkış Sistemini Kapatır.`\n\n> `!otorol -> Otomatik Rol Sistemini Açar/Kapatır.`\n\n> `!mod-log -> Mod Log Sistemini Açar/Kapatır.`",
    "**Moderasyon Komutları**\n\n\n> `!sayaç-ayarla -> Sayaç Sistemini Açar Kapatır`\n\n> `!sayaç-kanal-ayarla -> Sayaç Kanalını Ayarlamınızı Sağlar`\n> `!seviye-yardım -> Seviye Sistemi Yardım Menüsünü Açar.`\n\n> `!davet-yardım -> Davet Sistemi Yardım Menüsünü Açar`\n\n> `!tepki-rol-oluştur -> Tepki-Rol Sistemine Emoji Eklemenizi Sağlar.`",
    "**Moderasyon Komutları**\n\n\n> `!tepki-rol-sil -> Eklediğiniz Emojiyi Silmenize Yarar`\n\n> `!tepki-rol-liste -> Tepki-Rol Sistemine Eklediğiniz Emojileri Gösterir`\n\n> `!ticket aç -> Ticket Sistemini Aktif Hale Getirmenize Yardımcı Olur`\n\n> `!ticket kapat -> Ticket Sistemini Kapatır`\n\n> `!ist-sıfırla -> Ses ya da Yazı İstatistiklerini Sıfırlar`"
  ];
  let page = 1;

  const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setThumbnail(
      "https://cdn.discordapom/attachments/487719679868272689/488329963926192158/image0.png"
    )
    .setFooter(`Sayfa ${page} / ${pages.length} by MegsNaf and Rigby Reis`)
    .setDescription(pages[page - 1]);
  message.channel.send(embed).then(msg => {
    msg.react("⬅").then(r => {
      msg.react("➡");

      //Filter
      const backwardsFilter = (reaction, user) =>
        reaction.emoji.name === "⬅" && user.id === message.author.id;
      const forwardsFilter = (reaction, user) =>
        reaction.emoji.name === "➡" && user.id === message.author.id;

      const backwards = msg.createReactionCollector(backwardsFilter, {
        time: 100000
      });
      const forwards = msg.createReactionCollector(forwardsFilter, {
        time: 100000
      });

      forwards.on("collect", r => {
        if (page === pages.length) return;
        page++;
        embed.setDescription(pages[page - 1]);
        embed.setColor("RANDOM");
        embed.setFooter(`Sayfa ${page} / ${pages.length}`);
        msg.edit(embed);
      });
      backwards.on("collect", r => {
        if (page === 1) return;
        page--;
        embed.setColor("RANDOM");
        embed.setDescription(pages[page - 1]);
        embed.setFooter(`Sayfa ${page} / ${pages.length}`);
        msg.edit(embed);
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
  name: "moderasyon", //ashira
  description: "",
  usage: ""
};
