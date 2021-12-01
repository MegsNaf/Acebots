const Discord = require('discord.js');
const generator = require('generate-password');
const db = require("quick.db")
const Ashira = new Set();
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
  
    let karaliste = db.get(`karaliste_${message.author.id}`)
  if(karaliste === true) return message.channel.send(new Discord.MessageEmbed().setTitle("Erişiminiz Engellendi").setDescription(`**Erişiminizin Neden Engellendiğini Öğrenmek İçin [Ace Bot Destek](https://discord.gg/nakvtDCRfV) Sunucusuna Gelip \`MegsNaf yada Rigby Reis\` İle İletişime Geçiniz.**`).setTimestamp().setColor("RED").setImage("https://i.hizliresim.com/b3jbgkl.png").setThumbnail(message.author.avatarURL()))
  const ayarlar = require('../ayarlar.json')
  if(db.fetch(`bakim`)) {
  if (!ayarlar.sahip.includes(message.author.id)) {return message.channel.send('Şuanda Bakım Modu Açıktır.')}
}
    var uzunluk = args.slice(0).join(' ');

    if (!uzunluk) return message.reply('Bir uzunluk belirt. **Doğru Kullanım**: !şifre <uzunluk>')


    var password = generator.generate({
        length: uzunluk,
        numbers: true,
    })

    message.channel.send(password);
  
  client.channels.cache.get("878311926524944395").send(`**${message.author.tag}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`)
};  

exports.conf = {
  enabled: true, 
  guildOnly: true, 
  aliases: [],
  permLevel: 0 
};

exports.help = {
  name: 'şifre', 
  description: 'Rastgele bir şifre oluşturur.',
  usage: 'şifre <uzunluk>'
};