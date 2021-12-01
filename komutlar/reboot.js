const Discord = require('discord.js');


exports.run = function(client, message) {
   if(message.author.id !== "723537298364301334") if(message.author.id !== "348415047497809930")if(message.author.id !== "826022851525476362") return message.channel.send("Bu Komutu Sadece Bot Sahipleri Kullanabilir")

    message.channel.send("Bot yeniden başlatılıyor").then(msg => {
        console.log("[BOT]Yeniden başlatılıyor");
        process.exit(0);
    });
  
 client.channels.cache.get("878311926524944395").send(`**${message.author.tag}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`)

};

exports.conf = {
  enabled: true, 
  guildOnly: false, 
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'reboot', 
  description: 'Botu yeniden başlatır',
  usage: 'reboot'
};