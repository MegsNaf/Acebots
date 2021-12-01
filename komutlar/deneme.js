const Discord = require('discord.js');


exports.run = function(client, message, args) {
   if(message.author.id !== "723537298364301334") if(message.author.id !== "348415047497809930")if(message.author.id !== "826022851525476362") return message.channel.send("Bu Komutu Sadece Bot Sahipleri Kullanabilir")
let YazılacakMesaj = args.slice(1).join(' ');
const embed = new Discord.MessageEmbed()
embed.setDescription(YazılacakMesaj)
  message.mentions.channels.first().send(embed)
  
};

exports.conf = {
  enabled: true, //komutut açtık
  guildOnly: false, //sadece servere özel yapmadık
  aliases: ['ping','p'], //farklı çağrılar ekledik
  permLevel: 0 //kimlerin kullanabileceğini yazdık (bot.js dosyasında perm leveller yazıyor)
};

exports.help = {
  name: 'deneme', //adını belirledik (kullanmak için gereken komut)
  description: 'Botun pingini gösterir', //açıklaması
  usage: 'ping' //komutun kullanım şekli (mesela hava <bölge>)
};

//komut taslağımız basit anlatımını zaten dosyalarda bulursunuz
//bu ise bizim komut taslağımız
//bunun üzerinden gideceğiz