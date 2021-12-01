const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require("quick.db")
var prefix = ayarlar.prefix;

let role = "776000337700978739"
	var guildID = "713038138989084673";
	var channelID = "869674580720111696";
exports.run = async (bot, message, args) => {
    if (!message.member.roles.cache.has('749337052226519101')) return message.channel.send(new Discord.MessageEmbed().setDescription('Bu komutu kullanmak için **Moderatör** olman gerekmekte.').setColor(10038562));
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
    if (!rMember) return message.channel.send(new Discord.MessageEmbed().setDescription(`Lütfen bir kullanıcı ismi gir.\nÖrnek: ` + ayarlar.prefix + `50lvl **@MegsNaf**`).setColor(10038562).setAuthor(`${message.author.username} tarafından istendi.`, message.author.avatarURL()).setTimestamp());
  

    if (rMember.roles.cache.has(role)) return message.channel.send(new Discord.MessageEmbed().setDescription('Bu kullanıcı zaten bu rolde.').setColor(10038562));
    await (rMember.roles.add(role))
  		var embed = new Discord.MessageEmbed()
			.setTimestamp()
			.addField("Eylem:", "Rol Verme")
				.addField("Rol Veren Kullanıcı:", message.author)
			.addField("Rol Verilen Kullanıcı", `${rMember}`)
			.addField("Verilen Rol","\`🕶 dark brawler |50 level|\`" )
		
		bot.guilds.cache.get(guildID).channels.cache.get(channelID).send(embed);
    message.channel.send(new Discord.MessageEmbed().setDescription(`${rMember} isimli üyeye  \`🕶 dark brawler |50 level|\` isimli yetki başarıyla verildi! :white_check_mark:`).setFooter("Bu Komut Brawler Yes Sunucusuna Özeldir").setColor('RANDOM'));
db.add(`rolist${message.author.id}.${message.guild.id}`, 1)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rolver', 'rolekle'],
  permLevel: 0
};

exports.help = {
  name: "50lvl",
  description: "Kişilere Rol Yetkisi Verir",
  usage: "rolver <mesaj>"
};