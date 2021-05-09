const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }
  

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => { 
      bot.aliases.set(alias, props.help.name);
  
  });
});
})

//active/ready

const guildonlycounter = new Map();
    let stateswitch = false;

bot.on("ready", () => {
  setInterval(() => {
      stateswitch = !stateswitch; //change state
      if (stateswitch) bot.user.setActivity(`${botconfig.prefix}help`, { type: "PLAYING" });
      if (stateswitch) bot.user.setActivity(`Meezy#0226`, { type: "PLAYING" });
      else bot.user.setActivity(`${bot.guilds.cache.reduce((c, g) => c + g.memberCount, 0)}k User | ${bot.guilds.cache.size} Server | Made by: Meezy#0226 `, { type: "PLAYING" });
  }, 5000); //5 second delay



  bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = botconfig.prefix
    let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;

    if (bot.commands.has(cmd)) {
      commandfile = bot.commands.get(cmd);
  } else if (bot.aliases.has(cmd)) {
    commandfile = bot.commands.get(bot.aliases.get(cmd));
  }
  
      if (!message.content.startsWith(prefix)) return;

          
  try {
    commandfile.run(bot, message, args);
  
  } catch (e) {
  }}
  )})


bot.login("ODQwNzA1MTcwNjA5OTMwMzAx.YJcFtA.1FQl4wZNV1iOCy3hWpdrgJWxwQI");
