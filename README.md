<p align="center"><a href="https://nodei.co/npm/mongodb-reaction-role/"><img src="https://nodei.co/npm/mongodb-reaction-role.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-mongodb-prefix"> <img src="https://img.shields.io/github/repo-size/meister03/mongodb-reaction-role"> <img src="https://img.shields.io/npm/l/mongodb-reaction-role"> <img src="https://img.shields.io/github/contributors/mongodb-reaction-role">  <a href="https://discord.gg/YTdNBHh"><img src="https://discordapp.com/api/guilds/697129454761410600/widget.png" alt="Discord server"/></a></p>

# Discord Mongodb-reaction-role
A lightweight managing package to save/add/remove reaction roles and save them in a db. Intelligent saving ways to lower traffic up to 90% and prevent multipy fetches. This Package can be used for large bots too!

**If you need help feel free to join our <a href="https://discord.gg/YTdNBHh ">discord server</a>. We will provied you all help ☺**
# Download
You can download it from npm:
```cli
npm i mongodb-reaction-role
npm i mongoose  // when u did not installed it
```
# Note:
**When you want custom emoji reaction role, just pass on the `.createrr` method a emoji id instead of the emoji name**

**And on the MessageReaction Event:just fetch the reaction role with `reaction.emoji.id`  instead of `reaction.emoji.name`**
# Setting Up
First we include the module into the project (into your main bot file).
**Intent must me enabled. See more [here](https://cdn.discordapp.com/attachments/736254990619770981/797536603798634556/unknown.png)**
```js
const react = require("mongodb-reaction-role");
const client = new Discord.Client({
	autoReconnect: true,
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE", "USER"]
}); // this is required to get the messages of the reaction roles

// Attach React To The Client So We Can Access Anywhere
client.react = new Map(); 
client.fetchforguild = new Map();

```
After that, you have to provide a valid mongodb url and set the default prefix.
```js
react.setURL("mongodb://..."); // Connect React To Our DB

```

# Fetching Reaction Roles / Add Role

*Following examples assume that your `Discord.Client` is called `client`.*

```js
client.on('messageReactionAdd',async  (reaction  , user ) => {
  if (user.partial) await user.fetch();
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();
    let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
    if(!rolefetch) return;
    let member = await reaction.message.guild.members.cache.get(user.id)
    if(!member.roles.cache.has(rolefetch.roleid)){
       await member.roles.add(rolefetch.roleid)
       console.log(`Role on ${reaction.emoji.name} has been given`)
    }
  });
```

# Remove Role
```js
client.on('messageReactionRemove',async  (reaction, user) => {
 if (user.partial) await user.fetch();
 if (reaction.partial) await reaction.fetch();
 if (reaction.message.partial) await reaction.message.fetch();
 let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
 if(!rolefetch) return;
 let member = await reaction.message.guild.members.cache.get(user.id)
 if(member.roles.cache.has(rolefetch.roleid)){
  await member.roles.remove(rolefetch.roleid)
  console.log(`Role on ${reaction.emoji.name} has been given`)
  }
});
```

# Create/Delete a Reaction Role
```js
if(command === "createrr"){ /// you can use your command handler to, but look that you overgive the parameters client, message
///await react.createrr(client, message.guild.id ,"message.id" , "roleid" , "emoji");
/// !createrr <message.id> <roleid> <emoji>
if(!args[0] || !args[1] || !args[2]) return message.channel.send("Pls provide the arguments. ex: `!createrr <message.id> <roleid> <emoji>`")
await react.createrr(client, message.guild.id ,args[0] , args[1] , args[2], "false"); //the last field is : if the person should be dm
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
const { prefix, token , url } = require('./config.json');
const react = require("mongodb-reaction-role");
const client = new Discord.Client({
	autoReconnect: true,
	partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE", "USER"]
}); // this is required to get the messages of the reaction roles

client.react = new Map();  // do not rename here something, or else xD // save all msg id, role id
client.fetchforguild = new Map() // it will be saved, if the reaction roles were fetched from db
//// Add this
react.setURL(url);
client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageReactionAdd',async  (reaction  , user ) => {
  if (user.partial) await user.fetch();
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();
  
    let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
    if(!rolefetch) return;
    let member = await reaction.message.guild.members.cache.get(user.id)
    if(!member.roles.cache.has(rolefetch.roleid)){
       await member.roles.add(rolefetch.roleid)
       console.log(`Role on ${reaction.emoji.name} has been given`)
    }
  });

client.on('messageReactionRemove',async  (reaction, user) => {
  if (user.partial) await user.fetch();
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();
 
 let rolefetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
 if(!rolefetch) return;
 let member = await reaction.message.guild.members.cache.get(user.id)
 if(member.roles.cache.has(rolefetch.roleid)){
  await member.roles.remove(rolefetch.roleid)
  console.log(`Role on ${reaction.emoji.name} has been given`)
  }
});

client.on('message', async message => {
    if (message.author.bot) return;
//add this
 
/// add this
if (!message.content.startsWith(prefix)) return;
const args = message.content.slice(prefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

if(command === "createrr"){ /// you can use your command handler to, but look that you overgive the parameters client, message
///await react.createrr(client, message.guild.id ,"message.id" , "roleid" , "emoji");
/// !createrr <message.id> <roleid> <emoji>
if(!args[0] || !args[1] || !args[2]) return message.channel.send("Pls provide the arguments. ex: `!createrr <message.id> <roleid> <emoji>`")
await react.createrr(client, message.guild.id ,args[0] , args[1] , args[2], "false"); /// the last field is : if the person should be dm
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
const stats = new Discord.MessageEmbed()
.setTitle("Reaction roles stats")
.addField("Reaction roles found:" , "```" + client.react.size + " reaction roles" + "```")
.addField("Fetched Server:" , "```" + client.fetchforguild.size  + "```")
.setColor("YELLOW")
return message.channel.send(stats)
} 
});

// Connect To The Discord API And Log Errors.
client.login(token).catch(console.error);
```

*Is time for you to use the code creative..*

# Methods
**See if the reaction on the message id exist as reaction role or when not fetched in the db**
```js
let fetch = await react.fetchrr(client, reaction.message.guild.id ,reaction.message.id , reaction.emoji.name);
//undefined || or gives a map entry ==> fetch.roleid, fetch.messageid , fetch.reaction, fetch.guildid , fetch.dm
```
**Fetch all reaction roles and save them in a map (just use this for stats not for the reaction event)**
```js
await react.fetchallrr(client); 
```


**Have fun and feel free to contribute/suggest or contact me on my discord server or per dm on Meister#9667**

# Bugs, Glitches and Issues
If you encounter any problems fell free to open an issue in our <a href="https://github.com/meister03/mongodb-reaction-role/issues">github repository or join the discord server.</a>.
