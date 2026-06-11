const {
  PayoutOrder,
  PayoutProduk,
  RobloxCommunity,
  CommunityMember,
} = require("../models");

const makeOrderCode = require("../utils/makeOrderCode");

const {
  getUserByUsername,
  checkUserInGroup,
} = require("../services/robloxService");

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const countJoinDays = (joinedDetectedAt) => {
  if (!joinedDetectedAt) return 0;

  const joinedDate = new Date(joinedDetectedAt);
  const now = new Date();

  const diffMs = now.getTime() - joinedDate.getTime();

  return Math.floor(diffMs / DAY_IN_MS);
};

const getActiveCommunities = async () => {
  return await RobloxCommunity.findAll({
    where: {
      isActive: true,
    },
    order: [["createdAt", "ASC"]],
  });
};

const saveCommunityMember = async ({ robloxUser, community }) => {
  const now = new Date();

  let member = await CommunityMember.findOne({
    where: {
      robloxUserId: String(robloxUser.userId),
      groupId: String(community.groupId),
    },
  });

  if (!member) {
    member = await CommunityMember.create({
      robloxUserId: String(robloxUser.userId),
      robloxUsername: robloxUser.username,
      displayName: robloxUser.displayName || null,
      groupId: String(community.groupId),
      groupName: community.groupName,
      groupLink: community.groupLink,
      joinedDetectedAt: now,
      lastCheckedAt: now,
      isStillJoined: true,
    });

    console.log("COMMUNITY MEMBER CREATED JOINED:", {
      robloxUserId: robloxUser.userId,
      username: robloxUser.username,
      groupId: community.groupId,
      groupName: community.groupName,
    });

    return member;
  }

  const updatePayload = {
    robloxUsername: robloxUser.username,
    displayName: robloxUser.displayName || null,
    groupName: community.groupName,
    groupLink: community.groupLink,
    lastCheckedAt: now,
    isStillJoined: true,
  };

  if (!member.isStillJoined || !member.joinedDetectedAt) {
    updatePayload.joinedDetectedAt = now;
  }

  await member.update(updatePayload);

  console.log("COMMUNITY MEMBER UPDATED JOINED:", {
    robloxUserId: robloxUser.userId,
    username: robloxUser.username,
    groupId: community.groupId,
    groupName: community.groupName,
    joinedDetectedAt: member.joinedDetectedAt,
  });

  return member;
};

const markMemberNotJoined = async ({ robloxUser, community }) => {
  const now = new Date();

  let member = await CommunityMember.findOne({
    where: {
      robloxUserId: String(robloxUser.userId),
      groupId: String(community.groupId),
    },
  });

  if (!member) {
    member = await CommunityMember.create({
      robloxUserId: String(robloxUser.userId),
      robloxUsername: robloxUser.username,
      displayName: robloxUser.displayName || null,
      groupId: String(community.groupId),
      groupName: community.groupName,
      groupLink: community.groupLink,
      joinedDetectedAt: null,
      lastCheckedAt: now,
      isStillJoined: false,
    });

    console.log("COMMUNITY MEMBER CREATED NOT JOINED:", {
      robloxUserId: robloxUser.userId,
      username: robloxUser.username,
      groupId: community.groupId,
      groupName: community.groupName,
    });

    return member;
  }

  await member.update({
    robloxUsername: robloxUser.username,
    displayName: robloxUser.displayName || null,
    groupName: community.groupName,
    groupLink: community.groupLink,
    lastCheckedAt: now,
    isStillJoined: false,
  });

  console.log("COMMUNITY MEMBER UPDATED NOT JOINED:", {
    robloxUserId: robloxUser.userId,
    username: robloxUser.username,
    groupId: community.groupId,
    groupName: community.groupName,
  });

  return member;
};

const checkUserAllCommunities = async ({ robloxUser, communities }) => {
  const joinedCommunities = [];
  const notJoinedCommunities = [];
  const memberResults = [];

  for (const community of communities) {
    const joinCheck = await checkUserInGroup(
      robloxUser.userId,
      community.groupId
    );

    console.log("CHECK GROUP RESULT:", {
      username: robloxUser.username,
      userId: robloxUser.userId,
      groupId: community.groupId,
      groupName: community.groupName,
      isJoined: joinCheck.isJoined,
    });

    if (joinCheck.isJoined) {
      const member = await saveCommunityMember({
        robloxUser,
        community,
      });

      const joinedDays = countJoinDays(member.joinedDetectedAt);
      const isEligible14Days = joinedDays >= 14;

      joinedCommunities.push({
        id: community.id,
        groupId: community.groupId,
        groupName: community.groupName,
        groupLink: community.groupLink,
        isActive: community.isActive,
        isJoined: true,
        joinedDays,
        isEligible14Days,
      });

      memberResults.push(member);
    } else {
      const member = await markMemberNotJoined({
        robloxUser,
        community,
      });

      notJoinedCommunities.push({
        id: community.id,
        groupId: community.groupId,
        groupName: community.groupName,
        groupLink: community.groupLink,
        isActive: community.isActive,
        isJoined: false,
      });

      memberResults.push(member);
    }
  }

  return {
    joinedCommunities,
    notJoinedCommunities,
    memberResults,
  };
};

exports.checkUsername = async (req, res) => {
  try {
    const { robloxUsername } = req.body;

    if (!robloxUsername) {
      return res.status(400).json({
        message: "Username Roblox wajib diisi",
      });
    }

    const activeCommunities = await getActiveCommunities();

    if (!activeCommunities || activeCommunities.length === 0) {
      return res.status(400).json({
        message: "Belum ada community Roblox aktif",
      });
    }

    const robloxUser = await getUserByUsername(robloxUsername);

    if (!robloxUser) {
      return res.status(404).json({
        message: "Username Roblox tidak ditemukan",
      });
    }

    const { joinedCommunities, notJoinedCommunities, memberResults } =
      await checkUserAllCommunities({
        robloxUser,
        communities: activeCommunities,
      });

    const isJoinedAll = notJoinedCommunities.length === 0;
    const isJoinedAny = joinedCommunities.length > 0;

    const isEligible14Days =
      isJoinedAll &&
      joinedCommunities.length === activeCommunities.length &&
      joinedCommunities.every((item) => item.isEligible14Days === true);

    const minJoinedDays =
      joinedCommunities.length > 0
        ? Math.min(...joinedCommunities.map((item) => item.joinedDays))
        : 0;

    const communities = activeCommunities.map((community) => {
      const joined = joinedCommunities.find(
        (item) => String(item.groupId) === String(community.groupId)
      );

      if (joined) return joined;

      return {
        id: community.id,
        groupId: community.groupId,
        groupName: community.groupName,
        groupLink: community.groupLink,
        isActive: community.isActive,
        isJoined: false,
      };
    });

    return res.status(200).json({
      success: isJoinedAll && isEligible14Days,
      isJoined: isJoinedAll,
      isJoinedAny,
      isEligible14Days,
      joinedDays: minJoinedDays,

      message: !isJoinedAny
        ? "User belum bergabung ke semua community Roblox"
        : !isJoinedAll
        ? "User belum bergabung ke beberapa community Roblox"
        : !isEligible14Days
        ? `User sudah join semua community, tetapi belum 14 hari. Baru ${minJoinedDays} hari.`
        : "User sudah join semua community dan sudah minimal 14 hari",

      user: robloxUser,
      communities,
      joinedCommunities,
      notJoinedCommunities,
      members: memberResults,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengecek username Roblox",
      error: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { payoutProdukId, robloxUsername, nomorRekening } = req.body;

    const produk = await PayoutProduk.findByPk(payoutProdukId);

    if (!produk || !produk.isActive) {
      return res.status(404).json({
        message: "Produk payout tidak ditemukan atau tidak aktif",
      });
    }

    const activeCommunities = await getActiveCommunities();

    if (!activeCommunities || activeCommunities.length === 0) {
      return res.status(400).json({
        message: "Belum ada community Roblox aktif",
      });
    }

    const robloxUser = await getUserByUsername(robloxUsername);

    if (!robloxUser) {
      return res.status(404).json({
        message: "Username Roblox tidak ditemukan",
      });
    }

    const { joinedCommunities, notJoinedCommunities } =
      await checkUserAllCommunities({
        robloxUser,
        communities: activeCommunities,
      });

    const isJoinedAll = notJoinedCommunities.length === 0;

    if (!isJoinedAll) {
      return res.status(400).json({
        success: false,
        isJoined: false,
        message: "User belum bergabung ke semua community Roblox",
        notJoinedCommunities,
      });
    }

    const isEligible14Days = joinedCommunities.every(
      (item) => item.isEligible14Days === true
    );

    const minJoinedDays =
      joinedCommunities.length > 0
        ? Math.min(...joinedCommunities.map((item) => item.joinedDays))
        : 0;

    if (!isEligible14Days) {
      return res.status(400).json({
        success: false,
        isJoined: true,
        isEligible14Days: false,
        joinedDays: minJoinedDays,
        message: `User sudah join semua community, tetapi belum 14 hari. Baru ${minJoinedDays} hari.`,
        joinedCommunities,
      });
    }

    const paymentProof = req.file ? req.file.path : null;

const order = await PayoutOrder.create({
  orderId: makeOrderCode("PAYOUT"),
  payoutProdukId,
  productName: produk.namaProduk,
  totalPrice: produk.harga,
  robloxUsername,
  nomorRekening,
  paymentProof,
  status: paymentProof ? "pending" : "unpaid",
});

    res.status(201).json({
      message: "Order payout berhasil dibuat",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat order payout",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  const data = await PayoutOrder.findAll({
    include: PayoutProduk,
    order: [["createdAt", "DESC"]],
  });

  res.json({ data });
};

exports.updateStatus = async (req, res) => {
  const data = await PayoutOrder.findByPk(req.params.id);

  if (!data) {
    return res.status(404).json({
      message: "Order tidak ditemukan",
    });
  }

  await data.update({
    status: req.body.status,
  });

  res.json({
    message: "Status order payout berhasil diupdate",
    data,
  });
};