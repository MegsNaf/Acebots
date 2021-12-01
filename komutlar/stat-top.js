const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
const moment = require("moment");
require("moment-duration-format");
const Ashira = new Set();
// exports.onLoad = (client) => {};
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
      const db = require("quick.db")
  const ayarlar = require('../ayarlar.json')
  if(db.fetch(`bakim`)) {
  if (!ayarlar.sahip.includes(message.author.id)) {return message.channel.send('Şuanda Bakım Modu Açıktır.')}
}
    let karaliste = db.get(`karaliste_${message.author.id}`)
  if(karaliste === true) return message.channel.send(new Discord.MessageEmbed().setTitle("Erişiminiz Engellendi").setDescription(`**Erişiminizin Neden Engellendiğini Öğrenmek İçin [Ace Bot Destek](https://discord.gg/nakvtDCRfV) Sunucusuna Gelip \`MegsNaf yada Rigby Reis\` İle İletişime Geçiniz.**`).setTimestamp().setColor("RED").setImage("https://i.hizliresim.com/b3jbgkl.png").setThumbnail(message.author.avatarURL()))
      if (Ashira.has(message.author.id)) {
           return message.channel.send("`10` Saniyede Bir Kullanabilirsiniz");
    } else {
        Ashira.add(message.author.id);
        setTimeout(() => {
        message.delete();
          Ashira.delete(message.author.id);
        }, 10000);// milisaniye cinsinden
    } 
    const voiceData = vt.get(`stats.${message.guild.id}`) || undefined;
    const messageData = mdb.get(`stats.${message.guild.id}`) || undefined;

    let messageList = "Bilgi Bulunamadı.";
    if(messageData){
        messageList = Object.keys(messageData || {}).map(md => {
            return {
                Id: md,
                Total: Object.values(messageData[md].channels || {}).reduce((a, b) => a + b, 0)
            };
        }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n║");    
    }

    let voiceList = "Bilgi Bulunamadı.";
    if(voiceData){
        voiceList = Object.keys(voiceData || {}).map(md => {
            return {
                Id: md,
                Total: Object.values(voiceData[md].channels || {}).reduce((a, b) => a + b, 0)
            };
        }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hours,] m [minutes] s [seconds]")}\``).join("\n║");
    }

    let embed = new Discord.MessageEmbed();
  embed.setColor('#00ffd0')
    .setFooter('by. MegsNaf')
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .setDescription(`Aşağıda Ses Ve Mesaj Aktiflik Sıralamasını Görebilirsiniz.`)
    .addField("Ses Sıralaması;", `
    \`\`\`En Çok Seste Duran Kişilerin Sıralaması;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${voiceList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `)
    .addField("Sohbet Sıralaması;", `
   \`\`\`En Çok Mesaj Atan Kişilerin Sıralaması;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${messageList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `);    message.channel.send(embed);
   client.channels.cache.get("878311926524944395").send(`**${message.author}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sunucu", "sunucu-bilgi", "sbilgi", "sb"],
  permLevel: 0,
}
exports.help = {
  name: 'ist-sıralama',
  description: 'Etiketlediğiniz rol hakkında bilgi alırsınız.',
  usage: 'rol-bilgi [rol]'
};