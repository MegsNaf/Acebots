const db = require("quick.db");
const Discord = require("discord.js");
const client = new Discord.Client();
exports.run = async (bot, message, args) => {
  if (message.author.id !== "723537298364301334")
    if (message.author.id !== "348415047497809930")
      if (message.author.id !== "826022851525476362")
        return message.channel.send(
          "Bu Komutu Sadece Bot Sahipleri Kullanabilir"
        );
  let nesne = args[0];
  if (!nesne)
    return message.channel.send("Bir kullanıcının IDsini girmelisin?");

  db.set(`gold_${nesne}`, "gold");

  message.channel.send(`**${nesne}** IDli kullanıcı artık gold üye oldu!`);

  client.channels.cache
    .get("877141960564035584")
    .send(
      `**${message.author.tag}** Adlı Kullanıcı \`${exports.help.name}\` Komutunu Kullandı.`
    );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["gold-ver"],
  permLevel: 0
};
exports.help = {
  name: "gold-ver",
  description: "[Admin Komutu]",
  usage: "gold ver ID"
};
