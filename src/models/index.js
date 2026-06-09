const sequelize = require('../config/database');

const User = require('./User');
const VilogProduk = require('./VilogProduk');
const PayoutProduk = require('./PayoutProduk');
const LimsProduk = require('./LimsProduk');
const VilogOrder = require('./VilogOrder');
const PayoutOrder = require('./PayoutOrder');
const LimsOrder = require('./LimsOrder');
const RekeningPembayaran = require("./RekeningPembayaran");
const RobloxCommunity = require('./RobloxCommunity');
const ChatRoom = require('./ChatRoom');
const ChatMessage = require('./ChatMessage');
const CommunityMember = require("./CommunityMember");
const StoreSetting = require("./StoreSetting");
const Tumbal = require("./Tumbal");

VilogOrder.belongsTo(VilogProduk, { foreignKey: 'vilogProdukId' });
VilogProduk.hasMany(VilogOrder, { foreignKey: 'vilogProdukId' });

PayoutOrder.belongsTo(PayoutProduk, { foreignKey: 'payoutProdukId' });
PayoutProduk.hasMany(PayoutOrder, { foreignKey: 'payoutProdukId' });

LimsOrder.belongsTo(LimsProduk, { foreignKey: 'limsProdukId' });
LimsProduk.hasMany(LimsOrder, { foreignKey: 'limsProdukId' });

User.hasMany(RekeningPembayaran, {
  foreignKey: "userId",
  as: "rekeningPembayaran",
});

RekeningPembayaran.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

ChatRoom.hasMany(ChatMessage, { foreignKey: 'roomId' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'roomId' });

RobloxCommunity.hasMany(CommunityMember, {
  foreignKey: "groupId",
  sourceKey: "groupId",
});

CommunityMember.belongsTo(RobloxCommunity, {
  foreignKey: "groupId",
  targetKey: "groupId",
});

module.exports = {
  sequelize,
  User,
  VilogProduk,
  PayoutProduk,
  LimsProduk,
  VilogOrder,
  PayoutOrder,
  LimsOrder,
  RekeningPembayaran,
  RobloxCommunity,
  ChatRoom,
  ChatMessage,
  CommunityMember,
  Tumbal,
  StoreSetting,
};
