const Discord = require('discord.js');
const db = require("quick.db")
const Ashira = new Set();
const cevaplar = [
    "evet",
    "hayır",
    "belki",
    "olabilir",
    "daha sonra tekrar sor",
    "imkansız",
    "tabiki evet",
    "aptalsın",
    "botum ben",
    "bi fikrim yok"
];

exports.run = function(client, message, args) {
  
      if (Ashira.has(message.author.id)) {
           return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
    } else {
        Ashira.add(message.author.id);
        setTimeout(() => {
        message.delete();
          Ashira.delete(message.author.id);
        }, 10000);// milisaniye cinsinden
    } 

  
const db = require("quick.db")
  const ayarlar = require('../ayarlar.json')
  if(db.fetch(`bakim`)) {
  if (!ayarlar.sahip.includes(message.author.id)) {return message.channel.send('Şuanda Bakım Modu Açıktır.')}
}
  let karaliste = db.get(`karaliste_${message.author.id}`)
  if(karaliste === true) return message.channel.send(new Discord.MessageEmbed().setTitle("Erişiminiz Engellendi").setDescription(`**Erişiminizin Neden Engellendiğini Öğrenmek İçin [Ace Bot Destek](https://discord.gg/nakvtDCRfV) Sunucusuna Gelip \`MegsNaf yada Rigby Reis\` İle İletişime Geçiniz.**`).setTimestamp().setColor("RED").setImage("https://i.hizliresim.com/b3jbgkl.png").setThumbnail(message.author.avatarURL()))
    var soru = args.join(' ');

    var cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

    if(!soru) return message.reply('Bir Soru Belirt')
    else message.channel.send(cevap)
 client.channels.cache.get("878311926524944395").send(`**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`)
};  

exports.conf = {
  enabled: true, 
  guildOnly: true, 
  aliases: [],
  permLevel: 0 
};

exports.help = {
  name: 'soru', 
  description: 'Sihirli 8ball sorularınızı cevaplar',
  usage: 'soru <soru>'
};