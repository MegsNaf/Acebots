const discord = require("discord.js");
const { MessageButton } = require("discord-buttons");
const db = require("quick.db");
const Ashira = new Set();
exports.run = (client, message, args) => {
  const ayarlar = require("../ayarlar.json");
  if (db.fetch(`bakim`)) {
    if (!ayarlar.sahip.includes(message.author.id)) {
      return message.channel.send("Şuanda Bakım Modu Açıktır.");
    }
  }
  let karaliste = db.get(`karaliste_${message.author.id}`);
  if (karaliste === true)
    return message.channel.send(
      new discord.MessageEmbed()
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

  db.delete(`cevapladimi_${message.author.id}`);

  let sorular = [
    {
      soru:
        "Yeniliklerin sürekliliğini zorunlu gören Atatürk İlkesi, aşağıdakilerden hangisidir?",
      siklar: [
        "milliyetçilik",
        "cumhuriyetçilik",
        "laiklik",
        "halkçılık",
        "inkılapçılık"
      ],
      dogrucevap: "D"
    },
    {
      soru:
        "Millî Mücâdele’nin kazanılmasında, aşağıdaki Atatürk ilkelerinden hangisi daha etkili olmuştur?",
      siklar: [
        "cumhuriyetçilik",
        "milliyetçilik",
        "akılcılık",
        "devletçilik",
        "halkçılık"
      ],
      dogrucevap: "B"
    },
    {
      soru: "Fatih Sultan Mehmed'in Hocası Kimdir?",
      siklar: ["akşemsettin", "mevlana", "şeyh edebali", "tursun bey"],
      dogrucevap: "A"
    },
    {
      soru:
        "Aşağıdakilerden hangisi, 27 Mayıs 1960 Askerî Darbesi sonrasında kurulan, Genel Başkanlığını Ragıp Gümüşpala'nın üstlendiği ve Demokrat Partinin devamı niteliğinde olan siyasi partidir? (2018 KPSS SORUSU)",
      siklar: [
        "milli kalkınma partisi",
        "adalet partisi",
        "millet partisi",
        "hürriyet partisi",
        "ahali cumhuriyet partisi"
      ],
      dogrucevap: "B"
    },
    {
      soru:
        "“ Olmak ya da olmamak, işte bütün mesele bu.” sözüyle tanınan, Hamlet oyununun yazarı İngiliz edebiyatçı aşağıdakilerden hangisidir? (2018 KPSS SORUSU)",
      siklar: [
        "george eliot",
        "thomas more",
        "william shakespeare",
        "charles dickens",
        "daniel defoe"
      ],
      dogrucevap: "C"
    }
  ];
  var butonlararr = [];
  var engcharlar = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "I",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  let sorurandom = sorular[Math.floor(Math.random() * sorular.length)];
  for (var i = 0; i < sorurandom.siklar.length; i++) {
    var eklenecek = engcharlar[i].toLocaleUpperCase() + " - ";
    sorurandom.siklar[i] = eklenecek + sorurandom.siklar[i];
  }
  for (var i = 0; i < sorurandom.siklar.length; i++) {
    var karakterlerdençek = engcharlar[i].toLocaleUpperCase();
    butonlararr.push(
      new MessageButton()
        .setStyle("green")
        .setLabel(karakterlerdençek)
        .setID(karakterlerdençek)
    );
  }
  const Embed = new discord.MessageEmbed()
    .setTitle(sorurandom.soru)
    .setDescription(sorurandom.siklar.join("\n\n"))
    .setColor(`GREEN`)
    .setFooter(`Bu Soruya Cevap Vermek İçin 40 Saniyen Var!`);
  message.channel
    .send(Embed, {
      buttons: butonlararr
    })
    .then(async function(sorucollector) {
      sorucollector
        .createButtonCollector(
          user => user.clicker.user.id == message.author.id
        )
        .on("collect", async button => {
          if (button.id.toLowerCase() == sorurandom.dogrucevap.toLowerCase()) {
            const doğru = new discord.MessageEmbed()
              .setAuthor("✅ Doğru Cevap!")
              .setDescription("**Doğru Bildiniz!**")
              .setColor("GREEN");
            message.channel.send(doğru);
            button.reply.defer();
            db.set(`cevapladimi_${message.author.id}`, "evet");
            return sorucollector
              .delete()
              .catch(() => console.log("mesaj bulunamadı ama handlelandı"));
          } else {
            const yanlış = new discord.MessageEmbed()
              .setAuthor("❌ Yanlış Cevap!")
              .setDescription(
                `**Yanlış Cevap Verdiniz Doğru Cevap ${sorurandom.dogrucevap.toUpperCase()} Olmalıydı!**`
              )
              .setColor("RED");
            message.channel.send(yanlış);
            button.reply.defer();
            db.set(`cevapladimi_${message.author.id}`, "evet");
            return sorucollector
              .delete()
              .catch(() => console.log("mesaj bulunamadı ama handlelandı"));
          }
        });
      setTimeout(() => {
        if (db.has(`cevapladimi_${message.author.id}`)) return;
        sorucollector
          .delete()
          .catch(() => console.log("mesaj bulunamadı ama handlelandı"));
        const mesajyok = new discord.MessageEmbed()
          .setAuthor("❌ Soru İptal Edildi!")
          .setDescription("**Soruyu Çözmek İçin Verilen 40 Saniye Doldu!**")
          .setColor("RED");
        message.channel.send(mesajyok).then(msg => {
          setTimeout(() => {
            msg
              .delete()
              .catch(() => console.log("mesaj bulunamadı ama handlelandı"));
          }, 5000);
        });
      }, 40000);
    });

  client.channels.cache
    .get("878311926524944395")
    .send(
      `**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};

exports.conf = {
  enabled: true,
  aliases: ["bilgiyarışması"]
};

exports.help = {
  name: "bilgi-yarışması",
  description: "Bilgi Yarışması Oynarsınız.",
  usage: "trivia"
};
