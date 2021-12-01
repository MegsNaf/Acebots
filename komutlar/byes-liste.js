const Discord = require(`discord.js`);
const db = require(`quick.db`)

exports.run = async(client, message, args) => {
   if (!message.member.roles.cache.has('749337052226519101')) if(message.author.id !== "826022851525476362") return message.channel.send(new Discord.MessageEmbed().setDescription('Bu komutu kullanmak için **Moderatör** olman gerekmekte.').setColor(10038562));
let kişi = message.mentions.users.first()
if(!args[0]) {
    const stat = await db.fetch(`rolist${message.author.id}.${message.guild.id}`)
    const megesenaf = new Discord.MessageEmbed()
    .setThumbnail(message.author.avatarURL())
    .setTimestamp()
    .setFooter(`${message.author.tag} Tarafından İstendi.`)
    .setDescription(`**${message.author} İsimli Yetkilinin Toplam Kayıtı**
    **▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**
    **Toplam \`${stat ? stat : '0'}\` Rol Vermişsin.**
    **▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**`)
    message.channel.send(megesenaf)}
if(kişi) {
    const stat2 = await db.fetch(`rolist${kişi.id}.${message.guild.id}`)
    const megsnaf = new Discord.MessageEmbed()
    .setAuthor(kişi.username, kişi.avatarURL)
    .setThumbnail(message.mentions.users.first().avatarURL())
    .setTimestamp()
    .setFooter(`${message.author.tag} Tarafından İstendi.`)
    .setDescription(`**Yetkilinin Bilgileri**
    **▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**
    **Toplam \`${stat2 ? stat2 : '0'}\` Rol Vermiş.**
    **▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**`)
    message.channel.send(megsnaf)}  
};
exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ["stat"],
 permLevel: 0,
};
exports.help = {
 name: 'rol-liste'
};