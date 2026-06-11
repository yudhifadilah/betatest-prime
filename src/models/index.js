const sequelize = require("../config/localdatabase");

const User = require("./User");
const VilogProduk = require("./VilogProduk");
const PayoutProduk = require("./PayoutProduk");
const LimsProduk = require("./LimsProduk");
const GiftingProduk = require("./GiftingProduk");


const VilogOrder = require("./VilogOrder");
const PayoutOrder = require("./PayoutOrder");
const LimsOrder = require("./LimsOrder");
const GiftingOrder = require("./GiftingOrder");

const RekeningPembayaran = require("./RekeningPembayaran");
const RobloxCommunity = require("./RobloxCommunity");
const ChatRoom = require("./ChatRoom");
const ChatMessage = require("./ChatMessage");
const CommunityMember = require("./CommunityMember");
const StoreSetting = require("./StoreSetting");
const Tumbal = require("./Tumbal");

VilogOrder.belongsTo(VilogProduk, {
  foreignKey: "vilogProdukId",
});

GiftingOrder.belongsTo(GiftingProduk, {
  foreignKey: "giftingProdukId",
  as: "produk",
});

GiftingProduk.hasMany(GiftingOrder, {
  foreignKey: "giftingProdukId",
  as: "orders",
});

VilogProduk.hasMany(VilogOrder, {
  foreignKey: "vilogProdukId",
});

PayoutOrder.belongsTo(PayoutProduk, {
  foreignKey: "payoutProdukId",
});

PayoutProduk.hasMany(PayoutOrder, {
  foreignKey: "payoutProdukId",
});

LimsOrder.belongsTo(LimsProduk, {
  foreignKey: "limsProdukId",
});

LimsProduk.hasMany(LimsOrder, {
  foreignKey: "limsProdukId",
});

User.hasMany(RekeningPembayaran, {
  foreignKey: "userId",
  as: "rekeningPembayaran",
});

RekeningPembayaran.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

ChatRoom.hasMany(ChatMessage, {
  foreignKey: "roomId",
});

ChatMessage.belongsTo(ChatRoom, {
  foreignKey: "roomId",
});

RobloxCommunity.hasMany(CommunityMember, {
  foreignKey: "groupId",
  sourceKey: "groupId",
});

CommunityMember.belongsTo(RobloxCommunity, {
  foreignKey: "groupId",
  targetKey: "groupId",
});

GiftingOrder.belongsTo(GiftingProduk, {
  foreignKey: "giftingProdukId",
});

GiftingProduk.hasMany(GiftingOrder, {
  foreignKey: "giftingProdukId",
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
  GiftingOrder,
  GiftingProduk,
  RekeningPembayaran,

  RobloxCommunity,
  ChatRoom,
  ChatMessage,
  CommunityMember,

  Tumbal,
  StoreSetting,
};