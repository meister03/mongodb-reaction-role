const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  
  guildid: { type: String },
  msgid: { type: String},
  roleid: { type: String},
  reaction: { type: String }, /// Change the field name | add other Fields, do not forget the "," ;)
  dm: {type: Boolean }
});

module.exports = mongoose.model('Reactons', reactionSchema, "Reactions");
