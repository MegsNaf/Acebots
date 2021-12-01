const Discord = require('discord.js')
const db = require('quick.db')
const fetch = require("node-fetch")
exports.run = async(client, message, args) => {
   if(message.author.id !== "723537298364301334") if(message.author.id !== "348415047497809930")if(message.author.id !== "826022851525476362") return message.channel.send("Bu Komutu Sadece Bot Sahipleri Kullanabilir")
let ehe = args.slice(1).join(" ")
  if (message.author.bot) return;
    let user = args[0]
    if(!user) return message.channel.send(`Bir Kullanıcı id si girmelisin? ._.`);
    let fetched = db.fetch(`karaliste_${user}`);
    let sebep = db.get(`sebep_${user}`)
    if (!fetched) {
      db.set(`karaliste_${user}`, true); 
      db.set(`sebep_${user}`, ehe)
      if(ehe) return message.channel.send(`Bir Sebep Gir`);
      message.channel.send(`\`${user}\` ID li Kullanıcının Erişimi Engellendi!`);
    } else {
      return message.channel.send(`\`${user}\` zaten erişimi engellenmiş Sebebi : ${sebep}!`);
    }
  client.channels.cache.get("877556252379586602").send(
new Discord.MessageEmbed().setTitle("Bir Kullanıcının Erişimi Engellendi").setDescription(`**Engelleyen Kişi** \n> \`${message.author.tag}\` \n> **Sebep** \`${sebep}\` \n \n**Engellenen Kişi** \n> <@!${user}>`).setThumbnail(message.author.avatarURL({ dynamic: true })).setColor("#00F611")); 
  
client.channels.cache.get("877141960564035584").send(`**${message.author.tag}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`)  
};
exports.conf = {
enabled: true, 
guildOnly: true, 
aliases: ['erişim-engel', "erişim-kapat", "blacklist"],
permLevel: 0 
}

exports.help = {
name: "erişim-engelle",
description: 'p',
usage: 'erişim-engelle'
}


