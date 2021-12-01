const Discord = require('discord.js')
const db = require('quick.db') 
const fetch = require("node-fetch")
exports.run = async(client, message, args) => {
   if(message.author.id !== "723537298364301334") if(message.author.id !== "348415047497809930")if(message.author.id !== "826022851525476362") return message.channel.send("Bu Komutu Sadece Bot Sahipleri Kullanabilir")
  if (message.author.bot) return;


    let user = message.mentions.users.first();
    if(!user) return message.channel.send(`Bir Kullanıcı adı girmelisin? ._.`);
  let sebep = db.get(`sebep_${user}`)
    let fetched = db.fetch(`karaliste_${user.id}`)
    if(!fetched) {
      return message.channel.send(`\`${user.id}\` Bu Kullanıcı Zaten Komutları Kullanabiliyor!`);
    }else{
      db.delete(`sebep_${user.id}`)
      db.delete(`karaliste_${user.id}`)
      message.channel.send(`\`${user.id}\` Artık Komutları kullanabilir!`)
    }  
    client.channels.cache.get("877556252379586602").send(
new Discord.MessageEmbed().setTitle("Bir Erişim Engeli Açıldı").setDescription(`**Engeli Açan Kişi** \n> \`${message.author.tag}\` \n> **Sebep** \`${sebep}\` \n \n**Engeli Açılan Kişi Kişi** \n> <@!${user}>`).setThumbnail(message.author.avatarURL({ dynamic: true })).setColor("#00F611")); 

  client.channels.cache.get("877141960564035584").send(`**${message.author.tag}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`)
  
  
  
  
  
};

exports.conf = {
enabled: true, 
guildOnly: true, 
aliases: ['erişime-aç'],
permLevel: 0 
}

exports.help = {
name: "erişim-aç",
description: 'p',
usage: 'erişim-aç'
}


