const sequelize = require("../config/localdatabase");

const User = require("./User");
const VilogProduk = require("./VilogProduk");
const PayoutProduk = require("./PayoutProduk");
const LimsProduk = require("./LimsProduk");
const GiftingProduk = require("./giftingProduk");

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

/* =========================
   VILOG
========================= */

VilogOrder.belongsTo(VilogProduk, {
  foreignKey: "vilogProdukId",
  as: "vilogProduk",
});

VilogProduk.hasMany(VilogOrder, {
  foreignKey: "vilogProdukId",
  as: "vilogOrders",
});

/* =========================
   PAYOUT
========================= */

PayoutOrder.belongsTo(PayoutProduk, {
  foreignKey: "payoutProdukId",
  as: "payoutProduk",
});

PayoutProduk.hasMany(PayoutOrder, {
  foreignKey: "payoutProdukId",
  as: "payoutOrders",
});

/* =========================
   LIMS
========================= */

LimsOrder.belongsTo(LimsProduk, {
  foreignKey: "limsProdukId",
  as: "limsProduk",
});

LimsProduk.hasMany(LimsOrder, {
  foreignKey: "limsProdukId",
  as: "limsOrders",
});

/* =========================
   GIFTING
========================= */

GiftingOrder.belongsTo(GiftingProduk, {
  foreignKey: "giftingProdukId",
  as: "giftingProduk",
});

GiftingProduk.hasMany(GiftingOrder, {
  foreignKey: "giftingProdukId",
  as: "giftingOrders",
});

/* =========================
   REKENING
========================= */

User.hasMany(RekeningPembayaran, {
  foreignKey: "userId",
  as: "rekeningPembayaran",
});

RekeningPembayaran.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

/* =========================
   CHAT
========================= */

ChatRoom.hasMany(ChatMessage, {
  foreignKey: "roomId",
  as: "messages",
});

ChatMessage.belongsTo(ChatRoom, {
  foreignKey: "roomId",
  as: "room",
});

/* =========================
   COMMUNITY
========================= */

RobloxCommunity.hasMany(CommunityMember, {
  foreignKey: "groupId",
  sourceKey: "groupId",
  as: "members",
});

CommunityMember.belongsTo(RobloxCommunity, {
  foreignKey: "groupId",
  targetKey: "groupId",
  as: "community",
});

module.exports = {
  sequelize,

  User,

  VilogProduk,
  PayoutProduk,
  LimsProduk,
  giftingProduk,

  VilogOrder,
  PayoutOrder,
  LimsOrder,
  GiftingOrder,

  RekeningPembayaran,

  RobloxCommunity,
  ChatRoom,
  ChatMessage,
  CommunityMember,

  Tumbal,
  StoreSetting,
};
