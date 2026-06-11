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

const safeBelongsTo = (source, target, options) => {
  if (!source.associations[options.as]) {
    source.belongsTo(target, options);
  }
};

const safeHasMany = (source, target, options) => {
  if (!source.associations[options.as]) {
    source.hasMany(target, options);
  }
};

/* =========================
   VILOG
========================= */

safeBelongsTo(VilogOrder, VilogProduk, {
  foreignKey: "vilogProdukId",
  as: "vilogProduk",
});

safeHasMany(VilogProduk, VilogOrder, {
  foreignKey: "vilogProdukId",
  as: "vilogOrders",
});

/* =========================
   PAYOUT
========================= */

safeBelongsTo(PayoutOrder, PayoutProduk, {
  foreignKey: "payoutProdukId",
  as: "payoutProduk",
});

safeHasMany(PayoutProduk, PayoutOrder, {
  foreignKey: "payoutProdukId",
  as: "payoutOrders",
});

/* =========================
   LIMS
========================= */

safeBelongsTo(LimsOrder, LimsProduk, {
  foreignKey: "limsProdukId",
  as: "limsProduk",
});

safeHasMany(LimsProduk, LimsOrder, {
  foreignKey: "limsProdukId",
  as: "limsOrders",
});

/* =========================
   GIFTING
========================= */

safeBelongsTo(GiftingOrder, GiftingProduk, {
  foreignKey: "giftingProdukId",
  as: "giftingProduk",
});

safeHasMany(GiftingProduk, GiftingOrder, {
  foreignKey: "giftingProdukId",
  as: "giftingOrders",
});

/* =========================
   REKENING
========================= */

safeHasMany(User, RekeningPembayaran, {
  foreignKey: "userId",
  as: "rekeningPembayaran",
});

safeBelongsTo(RekeningPembayaran, User, {
  foreignKey: "userId",
  as: "owner",
});

/* =========================
   CHAT
========================= */

safeHasMany(ChatRoom, ChatMessage, {
  foreignKey: "roomId",
  as: "messages",
});

safeBelongsTo(ChatMessage, ChatRoom, {
  foreignKey: "roomId",
  as: "room",
});

/* =========================
   COMMUNITY
========================= */

safeHasMany(RobloxCommunity, CommunityMember, {
  foreignKey: "groupId",
  sourceKey: "groupId",
  as: "members",
});

safeBelongsTo(CommunityMember, RobloxCommunity, {
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
  GiftingProduk,

  VilogOrder,
  PayoutOrder,
  LimsOrder,
  giftingOrder,

  RekeningPembayaran,

  RobloxCommunity,
  ChatRoom,
  ChatMessage,
  CommunityMember,

  Tumbal,
  StoreSetting,
};
