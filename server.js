const Discord = require('discord.js');
const ayarlar = require('./ayarlar.json');
let _client = new Discord.Client();
if (ayarlar.Private_Server === true) {
    _client = new Discord.Client({
        fetchAllMembers: true
    });
}
const client = global.client = _client;

require('discord-buttons')(client);
const logs = require("discord-logs");
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require("quick.db");
const express = require("express");
const http = require("http");
const app = express();
const Jimp = require("jimp");


require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

app.get("/", (request, response) => {
  console.log('PİNKCODE 7/24 AKTİF TUTMA İŞLEMİ BAŞARILI');
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

  
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

console.log("--------------------------------");
console.log("Eventler Yükleniyor");
fs.readdirSync("./Events", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    client.on(prop.conf.event, prop.execute);
    console.log(`[EVENT] ${file} is loaded.`);
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.on("rateLimit", m => {
  console.log(`RateLimit Yedim: ${m.limit}`);
});
///ticket///
client.on("ready", function() {
  if(db.get("csticket")){
  Object.entries(db.get("csticket")).map(e => {
    const sunucu = client.guilds.cache.get(e[1].sunucuID)
       if(!sunucu){
      db.delete("csticket."+e[1].sunucuID)
    } else {
    const kanal = sunucu.channels.cache.get(e[1].kanal)
       if(!kanal){
      db.delete("csticket."+e[1].sunucuID)
    } else {
    const data = kanal.messages.fetch(e[1].mesajID)
    if(!data){
      db.delete("csticket."+e[1].sunucuID)
    } else {
  
      data.then(mr => {
        if(mr){
          mr.reactions.removeAll()
        mr.react("📨");
        }
      })
    }
    }
    }
  });
}
});

client.on("messageReactionAdd", (messageReaction, user) => {
  if (!user.bot) {
    let member = messageReaction.message.guild.members.cache.get(user.id);
  const data = db.get("csticket."+messageReaction.message.guild.id)
  
  if(data){
      if (data.mesajID === messageReaction.message.id) {
        if (messageReaction.emoji.name === "📨") {
     messageReaction.users.remove(user.id)
            const prefixx = "!"
let csrol = messageReaction.message.guild.roles.cache.get(data.rolID)
    let onl;
          let listedChannels = []
    messageReaction.message.guild.members.cache.forEach(p => {
      if (p.roles.cache.has(csrol.id)) {
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "idle") onl = ":orange_circle:" 
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "dnd") onl = ":red_circle:"
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "online") onl = ":green_circle:"
        if (messageReaction.message.guild.members.cache.get(p.id).user.presence.status === "offline") onl = ":white_circle:"

        listedChannels.push(`\`${p.user.tag}` + "\` " + onl );
      }
    });
    if (!messageReaction.message.guild.channels.cache.find(xx => xx.name === "DESTEK")) {
       messageReaction.message.guild.channels.create(`DESTEK`, { type: 'category'});
    }
    let a = messageReaction.message.guild.channels.cache.find(xxx => xxx.name === "DESTEK");
    if (messageReaction.message.guild.channels.cache.some(
        kk =>
          kk.name ===
          `destek-${messageReaction.message.guild.members.cache.get(member.id).user.username.toLowerCase() +
            messageReaction.message.guild.members.cache.get(member.id).user.discriminator}`
      ) == true
    )
      return messageReaction.message.channel.send(`**<@${user.id}>, Destek Sistemi Açma İşlemi Başarısız!\nSebep: \`Açılmış Zaten 1 Tane Destek Talebiniz Var.\`**`).then(mr => mr.delete({timeout:10000}))
    messageReaction.message.guild.channels.create(`destek-${member.user.tag}`)
      .then(async c => {
      if(a){
        c.setParent(a)
      }
      const gdl = client.guilds.cache.get(messageReaction.message.guild.id)
    if(gdl.roles.cache.get(data.rolID)){
      await c.createOverwrite(gdl.roles.cache.get(data.rolID), {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true
      });
    }
      await c.createOverwrite(gdl.roles.cache.find(r => r.name === '@everyone'), {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: false
      });
      await c.createOverwrite(member, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true
      });
    
    
        const embed = new Discord.MessageEmbed() //dcs ekibi
          .setColor("BLUE")
          .setAuthor(`${client.user.username} | Destek Sistemi`)
          .addField(
            `Merhaba ${user.username}!`,
            `Destek Yetkilileri Burada Seninle İlgilenecektir!\nDestek Talebini Kapatmak İçin \`kapat\` Yazabilirsin!`
          )
          .addField(`» Kullanıcı:`, `<@${user.id}>`)
          .addField(
            `**Destek Rolündeki Yetkililer;**`,          
`${listedChannels.join(`\n`) || "KİMSE YOK"}`
          )
          .setFooter(`${client.user.username} | Ace Bot Destek Sistemi`)
          .setTimestamp();
        c.send(embed);

        
      })
      .catch(console.error);
  }
          
        }
      }
 
  }
});


client.on("message", message => {
  const cprefix = "!"
  if (message.content.toLowerCase().startsWith(`kapat`)) {
    if (!message.channel.name.startsWith(`destek-`))
      return message.channel.send(
        `Bu Komut Sadece Destek Talebi Kanallarında Kullanılabilir!`
      );

    var deneme = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor(`Destek Talebi Kapatma İşlemi`)
      .setDescription(
        `Destek Talebini Kapatmayı Onaylamak İçin 10 Saniye İçinde \`evet\` Yazınız!`
      )
      .setFooter(`${client.user.username} | Ace Bot Destek Sistemi`);
    message.channel.send(deneme).then(m => {
      message.channel
        .awaitMessages(response => response.content === "evet", {
          max: 1,
          time: 10000,
          errors: ["time"]
        })
        .then(collected => {
          message.channel.delete(); //dcs ekibi
        })
        .catch(() => {
          m.edit("Destek Talebi Kapatma İsteğin Zaman Aşımına Uğradı!").then(
            m2 => {
              m2.delete({timeout:100});
            },
            5000
          );
        });
    });
  }
});


//____________________________özel oda_________________________________

client.on("voiceChannelJoin", async (member, channel) => {
  let f = db.fetch(`özeloda_${channel.guild.id}`);
  let ne = db.fetch(`odam_${member.id}_${channel.guild.id}`);
  let kontrol;
  if (ne) kontrol = member.guild.channels.cache.get(ne.channel.id);

  if (f) {
    let fe = f.find(a => a.k.id == channel.id);

    if (fe) {
      let bule = channel.guild.channels.cache.get(fe.k.id);
      if (ne) {
        if (!kontrol) {
          channel.guild.channels
            .create(`${member.user.username}`, {
              type: "voice",
              parent: bule.parent,
              reason: "Özel Oda sistemi Lrows"
            })
            .then(async a => {
              await db.set(`odam_${member.id}`, {
                durum: true,
                user: member.id,
                channel: a
              });
              await a.updateOverwrite(channel.guild.roles.everyone, {
                CONNECT: false
              });
              await a.updateOverwrite(member, {
                CONNECT: true
              });
              member.voice.setChannel(a.id);
              member.send(
                `✅ Özel Odanı Silmişler :/ Fakat üzülme ben yeniden açtım!`
              );
            });
          return;
        }
        await member.voice.setChannel(ne.channel.id);
        member.send(
          `✅ **Geç Odana bakayım!** Seni Odana attım Komutları Uygulayabilirsin.`
        );
        db.set(`odam_${member.id}_${channel.guild.id}.durum`, true);
        return;
      }

      if (!ne) {
        if (!bule)
          return channel.guild.channels.cache
            .filter(a => a.type == "text")
            .random()
            .send(
              `${channel.guild.owner}, Ayarladığınız özel oda kanalı olan \`${f.k.name}(${f.k.id})\` Bulanamadı! **${client.prefix}özel-oda çıkar ${f.k.id}**`
            );
        channel.guild.channels
          .create(`${member.user.username}`, {
            type: "voice",
            parent: bule.parent,
            reason: "Özel Oda sistemi Lrows"
          })
          .then(async a => {
            db.set(`odam_${member.id}_${channel.guild.id}`, {
              durum: true,
              user: member.id,
              channel: a
            });
            await member.voice.setChannel(a.id);
            await a.updateOverwrite(channel.guild.roles.everyone, {
              CONNECT: false
            });
            await a.updateOverwrite(member, {
              CONNECT: true
            });
            member.send(
              `✅ Özel Odanı Oluşturdum Komutlara Yardım Menüsünden Bakabilirsin!`
            );
          })
          .catch(e => console.error(e));
      }
    }

    if (ne && !fe) {
      let f = db.fetch(`özeloda_${channel.guild.id}`);

      let bule = channel.guild.channels.cache.get(f[0].k.id); //ilk gördüğü özel odanın kategorisine ekler.
      if (ne.channel.id == channel.id) {
        await db.set(`odam_${member.id}_${channel.guild.id}.durum`, true);
        member.send("Yeniden Hoşgeldin Patron, Ace Bot iyi Eğlenceler diler");
      }
      if (!kontrol) {
        channel.guild.channels
          .create(`${member.user.username}`, {
            type: "voice",
            parent: bule.parent,
            reason: "Ace Bot Özel Oda Sistemi"
          })
          .then(async a => {
            await a.updateOverwrite(channel.guild.roles.everyone, {
              CONNECT: false
            });
            await a.updateOverwrite(member, {
              CONNECT: true
            });
            member.send(
              `✅ Özel Odanı Silmişler :/ Fakat üzülme ben yeniden açtım!`
            );
            await db.set(`odam_${member.id}_${channel.guild.id}`, {
              durum: true,
              user: member.id,
              channel: a
            });
            member.voice.setChannel(a.id);
          });
        return;
      }
    }
  }
});
client.on("voiceChannelLeave", (member, channel) => {
  let f = db.fetch(`özeloda_${channel.guild.id}`);
  let ne = db.fetch(`odam_${member.id}_${channel.guild.id}`);
  if (f) {
    if (ne) {
      if (ne.durum == true) {
        if (channel.id == ne.channel.id) {
          member.send(
            `✅ Özel Odadan çıktınız  \`${client.prefix}kapat\` Yazarsanız odanızı Kapatabilirsiniz veya hep kalabilir`
          );
          db.set(`odam_${member.id}_${channel.guild.id}.durum`, false);
        }
      }
    }
  }
});

//////////küfür engel/////////////

const küfür = ["sik","ananı sikiyim","orosbu cocukları","orosbu evlatları","şerefsiz","oç","annesizler","amına koduklarım","yavşaklar","ibneler","piç","piçler","orosbu","orosbular","yarrak","yarraklar","yarraklarım","amcık","amcıklar","amın evlatları","daşşak","amk","aq","sg","sikikler","amın cocukları","ebenizi sikeyim","sikikler","bacınızı sikeyim","amcıklar","amın evlatları","amcık evlatları","götünüzü sikeyim","götünüzü sikim","sikiyim","sikim","sikik","ananızı sikiyim","babanızı sikiyim","sikem","siktim","sikerim","anneni sikerim","yarrağımın başı",];

client.on("messageUpdate", async (old, nev) => {

    if (old.content != nev.content) {
        let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
        let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
        if (i) {

            if (küfür.some(word => nev.content.includes(word))) {
                if (nev.member.hasPermission("BAN_MEMBERS")) return;
                //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
                const embed = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`${nev.author} , **Küfür Etmeye Çalıştı Ama Engelledim**`)
                    .addField("Gönderdiği Mesaj :", nev)

                nev.delete();
                const embeds = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`${nev.author} , **Mesajı Editleyerek Küfür Edeceğinimi Sandın?**`)
                client.channels.cache.get(y).send(embed)
                nev.channel.send(embeds).then(msg => msg.delete({
                    timeout: 5000
                }));

            }
        } else {}
        if (!i) return;
    }
});
//-----------------------GÜVENLİK-----------------------\\
//-----------------------GÜVENLİK-----------------------\\
//-----------------------GÜVENLİK-----------------------\\
//-----------------------GÜVENLİK-----------------------\\

client.on('guildMemberAdd', member => {
     let kanal = db.fetch(`güvenlik.${member.guild.id}`)
     if(!kanal) return;

       let aylar = {
               "01": "Ocak",
               "02": "Şubat",
               "03": "Mart",
               "04": "Nisan",
               "05": "Mayıs",
               "06": "Haziran",
               "07": "Temmuz",
               "08": "Ağustos",
               "09": "Eylül",
               "10": "Ekim",
               "11": "Kasım",
               "12": "Aralık"
    }

  let bitiş = member.user.createdAt
      let günü = moment(new Date(bitiş).toISOString()).format('DD')
      let ayı = moment(new Date(bitiş).toISOString()).format('MM').replace("01", "Ocak").replace("02","Şubat").replace("03","Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10","Ekim").replace("11","Kasım").replace("12","Aralık").replace("13","CodAre")//codare
     let yılı =  moment(new Date(bitiş).toISOString()).format('YYYY')
     let saati = moment(new Date(bitiş).toISOString()).format('HH:mm')

let günay = `${günü} ${ayı} ${yılı} ${saati}`  

      let süre = member.user.createdAt
      let gün = moment(new Date(süre).toISOString()).format('DD')
      let hafta = moment(new Date(süre).toISOString()).format('WW')
      let ay = moment(new Date(süre).toISOString()).format('MM')
      let ayy = moment(new Date(süre).toISOString()).format('MM')
      let yıl =  moment(new Date(süre).toISOString()).format('YYYY')
     let yıl2 = moment(new Date().toISOString()).format('YYYY')

     let netyıl = yıl2 - yıl

     let created = ` ${netyıl} yıl  ${ay} ay ${hafta} hafta ${gün} gün önce`

     let kontrol;
     if(süre < 1296000000) kontrol = 'Bu hesap şüpheli!'
     if(süre > 1296000000) kontrol = 'Bu hesap güvenli!'

     let codare = new Discord.MessageEmbed()
     .setColor('GREEN')
     .setTitle(`${member.user.username} Katıldı`)
     .setDescription('<@'+member.id+'> Bilgileri : \n\n  Hesap oluşturulma tarihi **[' + created + ']** (`' + günay + '`) \n\n Hesap durumu : **' + kontrol + '**')//codare
     .setTimestamp()
     client.channels.cache.get(kanal).send(codare)
})

//-----------------------GÜVENLİK SON-----------------------\\
//-----------------------GÜVENLİK SON-----------------------\\
//-----------------------GÜVENLİK SON-----------------------\\
//-----------------------GÜVENLİK SON----------------------\\

client.on("message", async msg => {


    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;
    let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);

    let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
    if (i) {
        if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
            try {
                if (!msg.member.hasPermission("MANAGE_GUILD")) {
                    //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
                    msg.delete({
                        timeout: 750
                    });
                    const embeds = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`<@${msg.author.id}> , **Bu Sunucuda Küfür Etmek Yasak!**`)
                    msg.channel.send(embeds).then(msg => msg.delete({
                        timeout: 5000
                    }));
                    const embed = new Discord.MessageEmbed().setColor("#ff7e00").setDescription(`${msg.author} , **Küfür Etmeye Çalıştı Ama Engelledim**`).addField("Gönderdiği Mesaj :", msg)
                    client.channels.cache.get(y).send(embed)
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    if (!i) return;
});

/////////////reklam engel//////////

client.on("message", async  msg => {
 var mayfe = await db.fetch(`reklam_${msg.guild.id}`)
    if (mayfe == 'acik') {
        const birisireklammidedi = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".rf.gd", ".az", ".party", "discord.gg",];
        if (birisireklammidedi.some(word => msg.content.includes(word))) {
          try {
            if (!msg.member.hasPermission("BAN_MEMBERS")) {
                  msg.delete();
                    return msg.reply('Bu Sunucuda Reklam Engelleme Filtresi Aktiftir. Reklam Yapmana İzin Veremem !').then(msg => msg.delete(3000));
    

  msg.delete(3000);                              

            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
    else if (mayfe == 'kapali') {
      
    }
    if (!mayfe) return;
  })

///mute///
client.on('roleDelete', async role => {
const data = await require('quick.db').fetch(`carl-mute-role.${role.guild.id}`);
if(data && data === role.id) require('quick.db').delete(`carl-mute-role.${role.guild.id}`); 
});

///////////////////////botu seslide tutma///////////////////////////////////////


client.on("ready", () => {
  client.channels.cache.get("878311926067789854").join();
   //main dosyaya atılacak
})


///sayaç////

client.on("message", async message => {
  if (!message.guild) return;

  if (db.has(`sayac_${message.guild.id}`) === true) {
    if (db.fetch(`sayac_${message.guild.id}`) <= message.guild.members.cache.size) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Tebrikler ${message.guild.name}!`)
        .setDescription(`Başarıyla \`${db.fetch(`sayac_${message.guild.id}`)}\` kullanıcıya ulaştık! Sayaç sıfırlandı!`)
        .setColor("RANDOM");
      message.channel.send(embed);
      message.guild.owner.send(embed);
      db.delete(`sayac_${message.guild.id}`);
    }
  }
});
client.on("guildMemberRemove", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});
client.on("guildMemberAdd", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucuya Katıldı :tada:! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});
//////yazı engel/////

const { MessageEmbed } = require("discord.js");
client.on('message', async msg =>{
  
  let Channel = await db.fetch(`yazıengel_${msg.guild.id}`);

  if (msg.channel.id !== Channel) return;

  if(msg.reference) return;
    
  if(msg.attachments.size == 0){
  
  if(msg.author.bot) return;
  
  msg.delete({timeout:500})
  
  msg.channel.send(new MessageEmbed()
  .setColor("RANDOM")
  .setAuthor(msg.author.username, msg.author.avatarURL())
  .setDescription(`${msg.author} Bu Kanala Sadece Resim Atabilirsin yada Atılmış Bir Resmi Yanıtlayabilirsin.`)
).then(m=>m.delete({timeout:5000}))
  
}
  if(msg.attachments.size > 0 ){
  msg.attachments.forEach(atch=>{
   if(atch.url.endsWith('.webp')||atch.url.endsWith('.png')||atch.url.endsWith('.jpeg')||atch.url.endsWith('.jpg'))
   if(atch.url.endsWith('.gif')){
    }
  })
}
})


//////////////////sa-as/////////////
client.on("message", async msg => {

  let saas = await db.fetch(`saas_${msg.guild.id}`);

  if (saas == 'kapali') return;

  if (saas == 'acik') {

  if (msg.content.toLowerCase() === 'sa') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'Sa') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'sA') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }

      if (msg.content.toLowerCase() === 'SA') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'sea') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'Sea') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'SEA') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'selam') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'Selam') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
      if (msg.content.toLowerCase() === 'SELAM') {

    msg.reply('Aleyküm Selam Hoş Geldin');

  }
  }

});


//////////////sa-as//////////////

////////////////////////


client.on("message", async msg => {
const request = require('node-superfetch');
const db = require('quick.db');
const asd = require('ms')
let timeout = 3600000000
let dakdest = await db.fetch(`goldzzz_${msg.author.id}`);
let i = db.fetch(`gold_${msg.author.id}`)
          if (i == 'gold') {
    if (dakdest !== null && timeout - (Date.now() - dakdest) > 0) {
        let time = asd(timeout - (Date.now() - dakdest));
    } else {
  if(msg.author.bot) return;   
  if (msg.content.length > 1) {
db.set(`goldzzz_${msg.author.id}`, Date.now());
    const embed = new Discord.MessageEmbed()
    .setDescription(`Bir gold üye belirdi :D`)
   msg.channel.send(embed)
  }
};
          }
   else if (i == undefined) {           
          }
          if (!i) return;
        
});

//-------------------- Otorol Sistemi --------------------//
//-------------------- Otorol Sistemi --------------------//
//-------------------- Otorol Sistemi --------------------//

client.on("guildMemberAdd", async member => {
  let kanal1 = await db.fetch(`otorolkanal_${member.guild.id}`);
  let rol1 = await db.fetch(`otorolrol_${member.guild.id}`);

  let kanal = member.guild.channels.cache.get(kanal1);
  let rol = member.guild.roles.cache.get(rol1);

  if (!kanal) return;
  if (!rol) return;

  const embed = new Discord.MessageEmbed()

    .setColor("BLACK")
    .setDescription(
      `Sunucuya Katılan **${member}** Adlı Kullanıcıya Başarıyla \`${rol.name}\` Rolü Verildi.`
    );

  kanal.send(embed);
  member.roles.add(rol);
});

//-------------------- Otorol Sistemi --------------------//
//-------------------- Otorol Sistemi --------------------//
//-------------------- Otorol Sistemi --------------------//


////////////////////////
////giriş çıkış/////
client.on("guildMemberRemove", async member => {
  //let resimkanal = JSON.parse(fs.readFileSync("./ayarlar/gç.json", "utf8"));
  //const canvaskanal = member.guild.channels.cache.get(resimkanal[member.guild.id].resim);
  
  if (db.has(`gçkanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.cache.get(db.fetch(`gçkanal_${member.guild.id}`));
  if (!canvaskanal) return;

  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucudan Ayrıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/dfqqhr8.png"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "ro-BOT-güle-güle.png"
  );

    canvaskanal.send(attachment);
    canvaskanal.send(
      msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
    );
    if (member.user.bot)
      return canvaskanal.send(`🤖 Bu bir bot, ${member.user.tag}`);
  
});

client.on("guildMemberAdd", async member => {
  if (db.has(`gçkanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.cache.get(db.fetch(`gçkanal_${member.guild.id}`));

  if (!canvaskanal || canvaskanal ===  undefined) return;
  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucuya Katıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let paket = await db.fetch(`pakets_${member.id}`);
  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/hqjsv6n.png"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) ;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "ro-BOT-hosgeldin.png"
  );

  canvaskanal.send(attachment);
  canvaskanal.send(
    msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
  );
  if (member.user.bot)
    return canvaskanal.send(`🤖 Bu bir bot, ${member.user.tag}`);
});


/////////eklendim-atıldım//////////

// eklendim
client.on('guildCreate', async guild => { client.channels.cache.get('878311928336896092').send(`\`${guild}\` İsimli Sunucuya Eklendim!`)});
// atıldım
client.on('guildRemove', async guild => { client.channels.cache.get('878311928336896092').send(`${guild}, isimli sunucudan atıldım..`)});


//-------------------- Ever Here Engel --------------------//
//-------------------- Ever Here Engel --------------------//
//-------------------- Ever Here Engel --------------------//

client.on("message", async msg => {
  let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
  if (hereengelle == "acik") {
    const here = ["@here", "@everyone"];
    if (here.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();
        msg.channel
          .send(`<@${msg.author.id}>`)
          .then(message => message.delete());
        var e = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(`Bu Sunucuda Everyone ve Here Yasak!`);
        msg.channel.send(e);
      }
    }
  } else if (hereengelle == "kapali") {
  }//lrowsxrd
});

//-------------------- Ever Here Engel --------------------//
//-------------------- Ever Here Engel --------------------//
//-------------------- Ever Here Engel --------------------//



///////////////Sunucu Panel////////


client.on("message", async (msg) => {
  let ever = msg.guild.roles.cache.find(c => c.name === "@everyone")
	let sistem = await db.fetch(`panell_${msg.guild.id}`);
	if(sistem == "açık") {
		let kategori = msg.guild.channels.cache.find(c => c.name.startsWith(msg.guild.name));
		if(!kategori) {
			msg.guild.channels.create(`${msg.guild.name} | Sunucu Paneli`, {
				type: 'category',
				permissionOverwrites: [{
					id: msg.guild.id,
					deny: ['CONNECT']
				}]
			}).then(parent => {
        setTimeout(async function() {
          let eo = msg.guild.roles.cache.find(r => r.name == "@everyone")
          parent.createOverwrite(eo, {
            CONNECT: false
          })
          setTimeout(async function() {
            parent.setPosition(0);
          })
          db.set(`panelParentID_${msg.guild.id}`, parent.id);
          let toplamUye = msg.guild.channels.cache.find(c => c.name.startsWith('Toplam Üye •'));
          if(!toplamUye) {
            try {
              let s = msg.guild.memberCount;
              msg.guild.channels.create(`Toplam Üye • ${s}`, {
                type: 'voice'
              }).then(ch => {
                setTimeout(function() {
                  ch.createOverwrite(ever, {
                    CONNECT: false
                  })
                  db.set(`toplamID_${msg.guild.id}`, ch.id)
                  ch.setParent(parent);
                  ch.setPosition(1);
                }, 120)
              })
            } catch (err) {

            }
          }
        let uyesayısı = msg.guild.channels.cache.find(c => c.name.startsWith('Üye Sayısı •'));
        if(!uyesayısı) {
          try {
            let uyesayı = msg.guild.members.cache.filter(m => !m.user.bot).size;
            msg.guild.channels.create(`Üye Sayısı • ${uyesayı}`, {
              type: 'voice'
            }).then(ch => {
              let ever = msg.guild.roles.cache.find(role => role.name === "@everyone")
                setTimeout(function() {
                ch.createOverwrite(ever, {
                  CONNECT: false
                })
                ch.setParent(parent);
                ch.setPosition(2);
                db.set(`uyeSayıID_${msg.guild.id}`, ch.id);
              }, 120)
            })
          } catch (err) {

          }
          let botsayı = msg.guild.members.cache.filter(m => m.user.bot).size;
          try {
            msg.guild.channels.create(`Bot Sayısı • ${botsayı}`, {
              type: 'voice'
            }).then(ch => {
              let ever = msg.guild.roles.cache.find(role => role.name === "@everyone")
              setTimeout(function() {
                ch.createOverwrite(ever, {
                  CONNECT: false
                })
                ch.setParent(parent);
                ch.setPosition(3);
                db.set(`botSayıID_${msg.guild.id}`, ch.id);
              }, 120)
            })
          } catch (err) {

          }
          let onl = msg.guild.members.cache.filter(m => m.presence.status != "offline" && !m.user.bot).size;
          try {
            msg.guild.channels.create(`Çevrimiçi Üye • ${onl}`, {
              type: 'voice'
            }).then(ch => {
              let ever = msg.guild.roles.cache.find(role => role.name === "@everyone");
              setTimeout(function() {
                ch.setParent(parent);
                ch.setPosition(4);
                db.set(`onlSayıID_${msg.guild.id}`, ch.id);
                ch.createOverwrite(ever, {
                  CONNECT: false
                })
              }, 120)
          })
        } catch (err) {
          
        }
      }
        }, 50)
			})
		} else {
      let parent = msg.guild.channels.cache.find(c => c.name == `${msg.guild.name} | Sunucu Paneli`)
      if(msg.content.includes('panel kapat')) return false;
      let toplamuye = msg.guild.channels.cache.find(c => c.name.startsWith(`Toplam Üye •`));
      toplamuye.setParent(parent);
      toplamuye.setName(`Toplam Üye • ${msg.guild.memberCount}`);
      let uyesayı = msg.guild.channels.cache.find(c => c.name.startsWith(`Üye Sayısı •`));
      uyesayı.setParent(parent);
      uyesayı.setName(`Üye Sayısı • ${msg.guild.members.cache.filter(m => !m.user.bot).size}`);
      let botuye = msg.guild.channels.cache.find(c => c.name.startsWith(`Bot Sayısı •`));
      botuye.setParent(parent);
      botuye.setName(`Bot Sayısı • ${msg.guild.members.cache.filter(m => m.user.bot).size}`);
      let onl = msg.guild.channels.cache.find(c => c.name.startsWith('Çevrimiçi Üye •'));
      onl.setParent(parent);
      onl.setName(`Çevrimiçi Üye • ${msg.guild.members.cache.filter(m => m.presence.status != "offline" && !m.user.bot).size}`);
		}
	} else {

	}
})  
///////seviye sistemi//////


client.on("message", async message => {
  let prefix = ayarlar.prefix;

  var id = message.author.id;
  var gid = message.guild.id;

  let hm = await db.fetch(`seviyeacik_${gid}`);
  let kanal = await db.fetch(`svlog_${gid}`);
  let xps = await db.fetch(`verilecekxp_${gid}`);
  let seviyerol = await db.fetch(`svrol_${gid}`);
  let rollvl = await db.fetch(`rollevel_${gid}`);

  if (!hm) return;
  if (message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  var xp = await db.fetch(`xp_${id}_${gid}`);
  var lvl = await db.fetch(`lvl_${id}_${gid}`);
  var xpToLvl = await db.fetch(`xpToLvl_${id}_${gid}`);

  if (!lvl) {
    if (xps) {
      db.set(`xp_${id}_${gid}`, xps);
    }
    db.set(`xp_${id}_${gid}`, 4);
    db.set(`lvl_${id}_${gid}`, 1);
    db.set(`xpToLvl_${id}_${gid}`, 100);
  } else {
    if (xps) {
      db.add(`xp_${id}_${gid}`, xps);
    }
    db.add(`xp_${id}_${gid}`, 4);

    if (xp > xpToLvl) {
      db.add(`lvl_${id}_${gid}`, 1);
      db.add(
        `xpToLvl_${id}_${gid}`,
        (await db.fetch(`lvl_${id}_${gid}`)) * 100
      );
      if (kanal) {
        client.channels.cache
          .get(kanal.id)
          .send(
            message.member.user.username +
              "** Seviye Atladı! Yeni seviyesi; `" +
              lvl +
              "` Tebrikler! :tada: **"
          );

      }
    }

    if (seviyerol) {
      if (lvl >= rollvl) {
        message.guild.member(message.author.id).roles.add(seviyerol);

        
      }
    }
  }

});

/////////müzik/////////////////
const onur = require('./ayarlar.json');
const { loadCommands } = require('./utils/loadCommands');
const DisTube = require('distube')
client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });
client.distube
 .on("playSong", (message, queue, song) =>{
 const embed1 = new Discord.MessageEmbed()
    .setTitle(`${song.name} isimli parça oynatılıyor.`)
    .setImage(`${song.thumbnail}`)  
  client.msg.edit(embed1)
    })
	.on("addSong", (message, queue, song) => message.channel.send(
        `${song.name} - \`${song.formattedDuration}\` ${song.user} tarafından sıraya eklendi`
    ).then(m => m.delete({ timeout: 5000 })
    ))
.on("finish", (message, que, song) =>{
const embed = new Discord.MessageEmbed()
    .setTitle('Şu anda şarkı çalınmıyor.')
    .setImage(`https://i.hizliresim.com/aufr7a7.png`)
    client.msg.edit(embed)
    });
client.on('clickButton', async(button) => {
 const embed = new Discord.MessageEmbed()
    .setTitle('Şu anda şarkı çalınmıyor.')
    .setImage(`https://i.hizliresim.com/aufr7a7.png`)
  const message = button.message;
  if(button.id == 'stop'){
    client.distube.stop(message)
    button.message.edit(embed)
    button.reply.send('Durduruldu.', true)
  }else if(button.id == 'pause'){
    client.distube.pause(message)
    button.reply.send('Duraklatıldı.', true)
  }else if(button.id == 'resume'){
    client.distube.resume(message)
    button.reply.send('Devam ettirildi.', true)
  }else if(button.id == 'que'){
    let queue = client.distube.getQueue(message);
        let curqueue = queue.songs.map((song, id) =>
        `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).join("\n");
    button.reply.send(curqueue).then(m => m.delete({ timeout: 300000 }))
  }else if(button.id == 'skip'){
    client.distube.skip(message)
    button.reply.send('Atlandı.', true)
}
})
///////////////////////////////

client.on('guildMemberAdd', async(member) => {
const kanal = `Son Üye • ${member.user.username}`
let channel = client.channels.cache.get("876921380996808706") //KANAL İD
channel.setName(kanal);
});
/////////////////////////captcha///////////

client.on("guildMemberAdd", async member => {

let zorluk = await db.fetch(`captchazorluk.${member.guild.id}`)  
if(!zorluk) return
let user = client.users.cache.get(member.id)
if(user.bot) return
  
 let kanal = await db.fetch(`captchaKanal.${member.guild.id}`)   
let rol = await db.fetch(`captcharol.${member.guild.id}`)  

  
let kolay = ["qdb","srd","koa","cuq","cvi","sub","rvs","dwi"
            ]


let orta = ["xnp","yluof","tuewa","saptn","gjegu","ygse","ncmg","aadf","wwwy","ozsoft"
           ]


let zor = ["hvoyoohd","jpjphytn","xjxwh","wwuljyndın","ıxdbksoo","ccggvxssz","svgngn","zngangzd","gmmcsax","saffoo","fasassf","rcttyq","qcmty","yevunqy","nmnnbqwb","trtwrcnrv"
          ]

 let s;
if(zorluk === "kolay") s = kolay  
if(zorluk === "orta") s = orta
if(zorluk === "zor") s = zor 
  
   let sonuc = (s[Math.floor(Math.random() * s.length)])
 let filtre = mes => mes.author.id === user.id;   

let beklenen;

  //KOLAY CAPTCHA
if(sonuc === "qdb") beklenen = "qdb"   
if(sonuc === "srd") beklenen = "srd"   
if(sonuc === "koa") beklenen = "koa"  
if(sonuc === "cuq") beklenen = "cuq"   
if(sonuc === "cvi") beklenen = "cvi"   
if(sonuc === "sub") beklenen = "sub"   
if(sonuc === "rvs") beklenen = "rvs"   
if(sonuc === "dwi") beklenen = "dwi"   

  //ORTA CAPTCHA  
if(sonuc === "xnp") beklenen = "xnp"   
if(sonuc === "yluof") beklenen = "yluof"   
if(sonuc === "tuewa") beklenen = "tuewa"   
if(sonuc === "saptn") beklenen = "saptn"   
if(sonuc === "gjegu") beklenen = "gjegu"   
if(sonuc === "ygse") beklenen = "ygse"   
if(sonuc === "ncmg") beklenen = "ncmg"   
if(sonuc === "aadf") beklenen = "aadf"   
if(sonuc === "wwwy") beklenen = "wwwy"   
if(sonuc === "ozsoft") beklenen = "ozsoft"   
  
  
  //ZOR CAPTCHA
if(sonuc === "hvoyoohd") beklenen = "hvoyoohd"   
if(sonuc === "jpjphytn") beklenen = "jpjphytn"   
if(sonuc === "xjxwh") beklenen = "xjxwh"   
if(sonuc === "wwuljyndın") beklenen = "wwuljyndın"   
if(sonuc === "ıxdbksoo") beklenen = "ıxdbksoo"   
if(sonuc === "ccggvxssz") beklenen = "ccggvxssz"   
if(sonuc === "svgngn") beklenen = "svgngn"   
if(sonuc === "zngangzd") beklenen = "zngangzd"   
if(sonuc === "gmmcsax") beklenen = "gmmcsax"   
if(sonuc === "saffoo") beklenen = "saffoo"   
if(sonuc === "fasassf") beklenen = "fasassf"   
if(sonuc === "rcttyq") beklenen = "rcttyq"   
if(sonuc === "qcmty") beklenen = "qcmty"   
if(sonuc === "yevunqy") beklenen = "yevunqy"   
if(sonuc === "nmnnbqwb") beklenen = "nmnnbqwb"   
if(sonuc === "trtwrcnrv") beklenen = "trtwrcnrv"

  let embed = new Discord.MessageEmbed()   
.setTitle(member.guild.name + ' Sunucusuna Hoşgeldin!')
.setDescription(`Lütfen captcha kodunu buraya gönderin.

**Merhaba!** Sunucuya girmeden önce bir captcha tamamlamanız gerekir.

**Neden?**
Bu, sunucuyu karşı korumak için yapılır!
Self botlara karşı önlem olarak kullanılabilir.

** Captcha'nız:** \`${sonuc}\`.`)
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('BLUE')      
user.send(embed).then(s => {
       
s.channel.awaitMessages(filtre, {
          max: 1,
        })
       
  .then(collected => {
 if(collected.first().content === beklenen) {
let embed = new Discord.MessageEmbed()   
.setTitle('Başarılı!')
.setDescription('**'+member.guild.name+'** Sunucusuna başarıyla giriş yaptınız.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('GREEN')    
 user.send(embed)
member.guild.members.cache.get(user.id).roles.add(rol)
        let kayıt1 = new Discord.MessageEmbed()   
.setTitle('Kayıt Başarılı!')
.setDescription('**'+user.tag+'** Adlı kullanıcı başarıyla kayıt oldu.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('GREEN')   
         if (!member.guild.channels.cache.get(kanal)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]  Kullandı`)
    else member.guild.channels.cache.get(kanal).send(kayıt1)  

 return
 } else {
   
user.send('**Deneme başarısız oldu.** Kalan 2 denemeniz var')   
           let kayıt = new Discord.MessageEmbed()   
                         .setTitle('Deneme Başarısız!')
.setDescription(''+user.tag+' Kodu yanlış girdi! **1/3** Denemesi kaldı!')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setColor('RED')   
             if (!member.guild.channels.cache.get(kanal)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]  Kullandı`)
    else member.guild.channels.cache.get(kanal).send(kayıt)  
   s.channel.awaitMessages(filtre, {
          max: 1,
        })
   .then(collected => {
 if(collected.first().content === beklenen) {
let embed = new Discord.MessageEmbed()   
.setTitle('Teşekkürler!')
.setDescription('**'+member.guild.name+'** Sunucusuna başarıyla giriş yaptınız.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('GREEN')    
 user.send(embed)
member.guild.members.cache.get(user.id).roles.add(rol)
        let kayıt1 = new Discord.MessageEmbed()   
.setTitle('Kayıt Başarılı!')
.setDescription('**'+user.tag+'** Adlı kullanıcı başarıyla kayıt oldu.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('GREEN')   
         if (!member.guild.channels.cache.get(kanal)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]  Kullandı`)
    else member.guild.channels.cache.get(kanal).send(kayıt1)  

 return
   
 } else {
user.send('**Deneme başarısız oldu.** Kalan 1 denemeniz var')
              let kayıt = new Discord.MessageEmbed()  
              .setTitle('Deneme Başarısız!')
.setDescription(''+user.tag+' Kodu yanlış girdi! **2/3** Denemesi kaldı!')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setColor('RED')   
             if (!member.guild.channels.cache.get(kanal)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]  Kullandı`)
    else member.guild.channels.cache.get(kanal).send(kayıt)  

s.channel.awaitMessages(filtre, {
          max: 1,
        })
   .then(collected => {
   if(collected.first().content === beklenen) {
let embed = new Discord.MessageEmbed()   
.setTitle('Teşekkürler!')
.setDescription('**'+member.guild.name+'** Sunucusuna başarıyla giriş yaptınız.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('GREEN')    
 user.send(embed)
member.guild.members.cache.get(user.id).roles.add(rol)
     let kayıt1 = new Discord.MessageEmbed()   
.setTitle('Kayıt Başarılı!')
.setDescription('**'+user.tag+'** Adlı kullanıcı başarıyla kayıt oldu.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setURL('https://discord.gg/nakvtDCRfV')
.setColor('GREEN')   
         if (!member.guild.channels.cache.get(kanal)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]  Kullandı`)
    else member.guild.channels.cache.get(kanal).send(kayıt1)  
     return
   
 } else {
let embed = new Discord.MessageEmbed()   
.setTitle('Bu Kötü!')
.setDescription('Maalesef 3 hakkınızı da yanlış girdiniz.Sunucuya giriş yapmanız engellendi.')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setColor('RED')    
 user.send(embed)  
        let kayıt = new Discord.MessageEmbed()   
.setTitle('Kayıt Başarısız!')
.setDescription('**'+user.tag+'** Kodu yanlış girdi! **3/3** Kayıt Başarısız!')
.setThumbnail(user.avatarURL())
.setFooter('Ace Bot Captcha Sistemi', client.user.avatarURL())
.setTimestamp()
.setColor('RED')   
             if (!member.guild.channels.cache.get(kanal)) return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]  Kullandı`)
    else member.guild.channels.cache.get(kanal).send(kayıt)  
   setTimeout(function() {
   member.kick()
  }, 2500)
 }
})
 }
})
   
 
 }  
    
  })
  

  
})  
   
   
}) 

///////////////////////
client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(process.env.token);
//-------------------- Mod Log Sistemi --------------------//
//-------------------- Mod Log Sistemi --------------------//
//-------------------- Mod Log Sistemi --------------------//

client.on('channelCreate', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    var embed = new Discord.MessageEmbed()
                    .addField(`Kanal oluşturuldu`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\nID: ${channel.id}`)
                    .setTimestamp()//lrowsxrd
                    .setColor("Black")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL())
    c.send(embed)
});

client.on('channelDelete', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    let embed = new Discord.MessageEmbed()
                    .addField(`Kanal silindi`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\nID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL())

    c.send(embed)
});

   client.on('channelNameUpdate', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    var embed = new Discord.MessageEmbed()
                    .addField(`Kanal İsmi değiştirildi`, ` Yeni İsmi: \`${channel.name}\`\nID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL())
    c.send(embed)
});

client.on('emojiCreate', emoji => {
  const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji oluşturuldu`, ` İsmi: \`${emoji.name}\`\n GIF?: **${emoji.animated}**\nID: ${emoji.id}`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL())

    c.send(embed)
    });
client.on('emojiDelete', emoji => {
  const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji silindi`, ` İsmi: \`${emoji.name}\`\n GIF? : **${emoji.animated}**\nID: ${emoji.id}`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL())

    c.send(embed)
    });
client.on('emojiUpdate', (oldEmoji, newEmoji) => {
  const c = newEmoji.guild.channels.cache.get(db.fetch(`codeminglog_${newEmoji.guild.id}`));
  if (!c) return;//lrowsxrd

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji güncellendi`, ` Eski ismi: \`${oldEmoji.name}\`\n Yeni ismi: \`${newEmoji.name}\`\nID: ${oldEmoji.id}`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${newEmoji.client.user.username}#${newEmoji.client.user.discriminator}`, newEmoji.client.user.avatarURL())

    c.send(embed)
    });

client.on('guildBanAdd', async (guild, user) => {    
    const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
  if (!channel) return;
  
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
                    .addField(`Kullanıcı banlandı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Sebep: **${entry.reason || 'Belirtmedi'}**\n Banlayan: **${entry.executor.username}#${entry.executor.discriminator}**`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL())

    channel.send(embed)
});
//lrowsxrd
client.on('guildBanRemove', async (guild, user) => {    
    const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
  if (!channel) return;
  
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL()())
                    .addField(`Kullanıcının banı açıldı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Banı Kaldıran: **${entry.executor.username}#${entry.executor.discriminator}**`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL()())

    channel.send(embed)
});
client.on('messageDelete', async message => {    
  if(message.author.bot) return

    const channel = message.guild.channels.cache.get(db.fetch(`codeminglog_${message.guild.id}`));
  if (!channel) return;
  //lrowsxrd
    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL()())//lrowsxrd
                    .setTitle("Mesaj silindi")                
                    .addField(`Silinen mesaj : ${message.content}`,`Kanal: ${message.channel.name}`)
                  //  .addField(`Kanal:`,`${message.channel.name}`)
                    .setTimestamp()
                    .setColor("Black")
                    .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL()())

    channel.send(embed)
});

client.on('messageUpdate', async(oldMessage, newMessage) => {
    if(oldMessage.author.bot) return;
    if(oldMessage.content == newMessage.content) return;

    const channel = oldMessage.guild.channels.cache.get(db.fetch(`codeminglog_${oldMessage.guild.id}`));
    if(!channel) return;

    let embed = new Discord.MessageEmbed()
    .setTitle("Mesaj güncellendi!")
    .addField("Eski mesaj : ",`${oldMessage.content}`)
    .addField("Yeni mesaj : ",`${newMessage.content}`)
    .addField("Kanal : ",`${oldMessage.channel.name}`)
    .setTimestamp()
    .setColor("Black")
    .setFooter(`${oldMessage.client.user.username}#${oldMessage.client.user.discriminator}`,`${oldMessage.client.user.avatarURL()()}`)
//lrowsxrd
    channel.send(embed)
});
client.on('roleCreate', async (role) => {    

    const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
.addField(`Rol oluşturuldu`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
.setTimestamp()//lrowsxrd
.setColor("Black")
.addField("Rol renk kodu : ",`${role.hexColor}`)
.setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL())

    channel.send(embed)//lrowsxrd
});

client.on('roleDelete', async (role) => {    
//lrowsxrd
    const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
.addField(`Rol silindi`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
.setTimestamp()
.setColor("Black")//lrowsxrd
    .addField("Rol renk kodu : ",`${role.hexColor}`)
.setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL())

    channel.send(embed)
})
client.on('voiceStateUpdate', (oldState, newState) => {
  
 // if (!logA[oldState.guild.id]) return;
  
  if (db.has(`codeminglog_${oldState.guild.id}`) === false) return;//lrowsxrd
  
  var kanal = oldState.guild.channels.cache.get(db.fetch(`codeminglog_${oldState.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  //lrowsxrd
  let newUserChannel = newState.voice.channel
  let oldUserChannel = oldState.voice.channel

  if(oldUserChannel === undefined && newUserChannel !== undefined) {//lrowsxrd

    const embed = new Discord.MessageEmbed()
    .setColor("Black")
    .setDescription(`${newState.user.tag} adlı kullanıcı \`${newUserChannel.name}\` isimli sesli kanala giriş yaptı!`)
    kanal.send(embed);
    //lrowsxrd
  } else if(newUserChannel === undefined){
//lrowsxrd
    const embed = new Discord.MessageEmbed()
    .setColor("Black")
    .setDescription(`${newState.user.tag} adlı kullanıcı sesli kanaldan çıkış yaptı!`)
    kanal.send(embed);
    
  }
});
//lrowsxrd//lrowsxrd
//-------------------- Mod Log Sistemi --------------------//
//-------------------- Mod Log Sistemi --------------------//
//-------------------- Mod Log Sistemi --------------------////lrowsxrd//lrowsxrd

//KanalKoruma

client.on("channelDelete", async function(channel) {
    let rol = await db.fetch(`kanalk_${channel.guild.id}`);
  
  if (rol) {
const guild = channel.guild.cache;
let channelp = channel.parentID;

  channel.clone().then(z => {
    let kanal = z.guild.channels.cache.find(c => c.name === z.name);
    kanal.setParent(
      kanal.guild.channels.cache.find(channel => channel.id === channelp)
      
    );
  });
  }
})

//RolKoruma

client.on("roleDelete", async role => {
  let kanal = await db.fetch(`rolk_${role.guild.id}`);
  if (!kanal) return;
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == role.guild.owner.id) return;
  if(!entry.executor.hasPermission('ROLE_DELETE')) {
      role.guild.roles.create({
        data: {
    name: role.name,
    color: role.hexColor,
    permissions: role.permissions
        },
        reason: "koruma"
  });
   let emran = new Discord.MessageEmbed()
   .setColor('0x36393E')
   .setTitle(`Bir rol silindi !`)
   .setDescription(`Silinen rol adı ${role.name}, Rol koruma sistemi açık olduğu için rol geri oluşturuldu!`)
   client.channels.cache.get(kanal).send(emran)
  }
});


// DAVET SİSTEMİ //
const invites = {};

const wait = require("util").promisify(setTimeout);

client.on("ready", () => {
  wait(1000);

  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});
//BUMBEGABRAK
client.on("guildMemberRemove", async member => {
  let kanal = await db.fetch(`davetkanal_${member.guild.id}`);
  if (!kanal) return;
  let veri = await db.fetch(`rol1_${member.guild.id}`);
  let veri12 = await db.fetch(`roldavet1_${member.guild.id}`);
  let veri21 = await db.fetch(`roldavet2_${member.guild.id}`);
  let veri2 = await db.fetch(`rol2_${member.guild.id}`);
  let d = await db.fetch(`bunudavet_${member.id}`);
  const sa = client.users.cache.get(d);
  const sasad = member.guild.members.cache.get(d);
  let sayı2 = await db.fetch(`davet_${d}_${member.guild.id}`);
  db.add(`davet_${d}_${member.guild.id}`, -1);

  if (!d) {
   
        client.channels.cache.get(kanal).send(`<@!${member.user.id}> Adlı kullanıcı ayrıldı! **Davet Eden: \`Bulunamadı\`**`);
    return;
  } else {

    client.channels.cache.get(kanal).send(`<@!${member.user.id}> Adlı kullanıcı ayrıldı! **Davet Eden: ${sa.tag}**`);

    if (!veri) return;

    if (sasad.roles.cache.has(veri)) {
      if (sayı2 <= veri12) {
        sasad.roles.remove(veri);
        return;
      }
    }
    if (sasad.roles.cache.has(veri2)) {
      if (!veri2) return;
      if (sayı2 <= veri21) {
        sasad.roles.remove(veri2);
        return;
      }
    }
  }
});

client.on("guildMemberAdd", async member => {
  member.guild.fetchInvites().then(async guildInvites => {
    let veri = await db.fetch(`rol1_${member.guild.id}`);
    let veri12 = await db.fetch(`roldavet1_${member.guild.id}`);
    let veri21 = await db.fetch(`roldavet2_${member.guild.id}`);
    let veri2 = await db.fetch(`rol2_${member.guild.id}`);
    let kanal = await db.fetch(`davetkanal_${member.guild.id}`);
    if (!kanal) return;
    const ei = invites[member.guild.id];

    invites[member.guild.id] = guildInvites;

    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    
    
    const sasad = member.guild.members.cache.get(invite.inviter.id);
    const davetçi = client.users.cache.get(invite.inviter.id);

    db.add(`davet_${invite.inviter.id}_${member.guild.id}`, +1);
    db.set(`bunudavet_${member.id}`, invite.inviter.id);
    let sayı = await db.fetch(`davet_${invite.inviter.id}_${member.guild.id}`);

    let sayı2;
    if (!sayı) {
      sayı2 = 0;
    } else {
      sayı2 = await db.fetch(`davet_${invite.inviter.id}_${member.guild.id}`);
    }

    client.channels.cache.get(kanal).send(`<@!${member.user.id}> sunucuya katıldı; **${davetçi.tag} (${davetçi.id})** adlı kullanıcı davet etti (**${sayı2}** Adet daveti bulunmakta.)`)
    if (!veri) return;

    if (!sasad.roles.cache.has(veri)) {
      if (sayı2 => veri12) {
        sasad.roles.add(veri);
        return;
      }
    } else {
      if (!veri2) return;
      if (sayı2 => veri21) {
        sasad.roles.add(veri2);
        return;
      }
    }
  });
});//BUMBEGABRAK