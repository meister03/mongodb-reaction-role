<p align="center"><a href="https://nodei.co/npm/mongodb-reaction-role/"><img src="https://nodei.co/npm/mongodb-reaction-role.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-mongodb-prefix"> <img src="https://img.shields.io/github/repo-size/meister03/mongodb-reaction-role"> <img src="https://img.shields.io/npm/l/mongodb-reaction-role"> <img src="https://img.shields.io/github/contributors/mongodb-reaction-role">  <a href="https://discord.gg/YTdNBHh"><img src="https://discordapp.com/api/guilds/697129454761410600/widget.png" alt="Discord server"/></a></p>

# Discord Mongodb-reaction-role
A lightweight managing package to save/add/remove reaction roles and save them in dm. Intelligent saving ways to lower traffic up to 90% and prevent multipy fetches.

**If you need help feel free to join our <a href="https://discord.gg/YTdNBHh ">discord server</a>. We will provied you all help ☺**
# Download
You can download it from npm:
```cli
npm i mongodb-reaction-role
npm i mongoose  // when u did not installed it
```

# Setting Up
First we include the module into the project (into your main bot file).
```js
const react = require("mongodb-reaction-role");
const client = new Discord.Client({
	autoReconnect: true,
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE", "USER"]
}); // his required to get the messages of the reaction roles
client.react = new Map();  // do not rename here something, or else Dx // save all msg id, role id
client.fetchforguild = new Map() // here it will be save if the reaction roles were fetched from db
```
After that, you have to provide a valid mongodb url and set the default prefix.
```js
react.setURL("mongodb://..."); //builts a connection with the db

```

# Fetching Reaction Roles/ Add Role

*Following examples assume that your `Discord.Client` is called `client`.*

```js
client.on('messageReactionAdd',async  (client ,reaction, user) => {
 let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
 if(rolefetch){
 let roletoadd = await react.message.guild.roles.cache.get(rolefetch.roleid);
 if(!user.roles.has(roletoadd)){
  await user.roles.add(roletoadd)
 }
 }
});
```
# Remove Role
```js
client.on('messageReactionRemove',async  (client ,reaction, user) => {
 let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
 if(rolefetch){
 let roletoremove = await react.message.guild.roles.cache.get(rolefetch.roleid);
 if(user.roles.has(roletoremove)){
  await user.roles.remove(roletoremove)
 }
 }
});
```
# Create/Delete a Reaction Role
```js
if(command === "createrr"){ /// you can use your command handler to, but look that you overgive the parameters client, message
///await react.createrr(client, message.guild.id ,"message.id" , "roleid" , "emoji");
/// !createrr <message.id> <roleid> <emoji>
if(!args[0] || !args[1] || !args[2]) return message.channel.send("Pls provide the arguments. ex: `!createrr <message.id> <roleid> <emoji>`")
await react.createrr(client, message.guild.id ,args[0] , args[1] , args[2]);
message.channel.send("Successfully created the reaction role!")
}
```
```js
if(command === "deleterr"){ 
/// await react.deleterr(client, message.guild.id ,"message.id" , "emoji");
/// !deleterr <message.id> <emoji> 
if(!args[0] || !args[1]) return message.channel.send("Pls provide the arguments. ex: `!deleterr <message.id> <emoji>`")
await react.deleterr(client, message.guild.id ,args[0] , args[1]);
message.channel.send("Successfully deleted the reaction role!")
}
```
```js
if(command === "editrr"){
///await react.createrr(client, message.guild.id ,"message.id" , "roleid" , "emoji");
/// !editrr <message.id> <new.roleid> <emoji>
if(!args[0] || !args[1] || !args[2]) return message.channel.send("Pls provide the arguments. ex: `!editrr <message.id> <new.roleid> <emoji>`")
await react.editrr(client, message.guild.id ,args[0] , args[1] , args[2]);
message.channel.send("Successfully edited the reaction role!")
}
```
# Whole Code
```js 
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const react = require("mongodb-reaction-role");
const client = new Discord.Client({
	autoReconnect: true,
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE", "USER"]
}); // his required to get the messages of the reaction roles

client.react = new Map();  // do not rename here something, or else Dx // save all msg id, role id
client.fetchforguild = new Map() // here it will be save if the reaction roles were fetched from db
//// Add this

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageReactionAdd',async  (client ,reaction, user) => {
 let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
 if(rolefetch){
 let roletoadd = await react.message.guild.roles.cache.get(rolefetch.roleid);
 if(!user.roles.has(roletoadd)){
  await user.roles.add(roletoadd)
 }
 }
});

client.on('messageReactionRemove',async  (client ,reaction, user) => {
 let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
 if(rolefetch){
 let roletoremove = await react.message.guild.roles.cache.get(rolefetch.roleid);
 if(user.roles.has(roletoremove)){
  await user.roles.remove(roletoremove)
 }
 }
});

client.on('message', async message => {
    if (message.author.bot) return;
//add this
  const fetchprefix = await mongopref.fetch(client, message.guild.id);
  console.log(fetchprefix.prefix)
/// add this
if (!message.content.startsWith(fetchprefix.prefix)) return;
const args = message.content.slice(fetchprefix.prefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

if(command === "createrr"){ /// you can use your command handler to, but look that you overgive the parameters client, message
///await react.createrr(client, message.guild.id ,"message.id" , "roleid" , "emoji");
/// !createrr <message.id> <roleid> <emoji>
if(!args[0] || !args[1] || !args[2]) return message.channel.send("Pls provide the arguments. ex: `!createrr <message.id> <roleid> <emoji>`")
await react.createrr(client, message.guild.id ,args[0] , args[1] , args[2]);
message.channel.send("Successfully created the reaction role!")
}
if(command === "deleterr"){ 
/// await react.deleterr(client, message.guild.id ,"message.id" , "emoji");
/// !deleterr <message.id> <emoji> 
if(!args[0] || !args[1]) return message.channel.send("Pls provide the arguments. ex: `!deleterr <message.id> <emoji>`")
await react.deleterr(client, message.guild.id ,args[0] , args[1]);
message.channel.send("Successfully deleted the reaction role!")
}
if(command === "editrr"){
///await react.createrr(client, message.guild.id ,"message.id" , "roleid" , "emoji");
/// !editrr <message.id> <new.roleid> <emoji>
if(!args[0] || !args[1] || !args[2]) return message.channel.send("Pls provide the arguments. ex: `!editrr <message.id> <new.roleid> <emoji>`")
await react.editrr(client, message.guild.id ,args[0] , args[1] , args[2]);
message.channel.send("Successfully edited the reaction role!")
}
if(command === "rrstats"){
var all = await mongopref.fetchall();
const stats = new Discord.MessageEmbed()
.setTitle("Prefix stats")
.addField("Prefix saved on Map:" , "```" + client.prefix.size + " prefix saved" + "```")
.addField("Different Prefix:","```" + Object.keys(all).length + " Servers have a another prefix"+ "```")
.addField("Servers with default prefix:" ,"```" + Number(client.guilds.cache.size-Object.keys(all).length) + " Servers are not saved in db"+ "```")
.setColor("YELLOW")
return message.channel.send(stats)
} 
});
client.login(token);
```

*Is time for you to use the code creative..*

# Methods
**Fetch all reaction roles and save them in a map**
```js
react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name); 
```
**Have fun and feel free to contribute/suggest or contact me on my discord server or per dm on Meister#9667**

# Bugs, Glitches and Issues
If you encounter any problems fell free to open an issue in our <a href="https://github.com/meister03/mongodb-reaction-role/issues">github repository or join the discord server.</a>.
