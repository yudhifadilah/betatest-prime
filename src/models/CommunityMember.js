const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityMember = sequelize.define("CommunityMember", {
  robloxUserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  robloxUsername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  groupLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  joinedDetectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastCheckedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isStillJoined: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = CommunityMember;