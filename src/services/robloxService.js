const axios = require('axios');

exports.getUserByUsername = async (username) => {
  const response = await axios.post('https://users.roblox.com/v1/usernames/users', {
    usernames: [username],
    excludeBannedUsers: true,
  });

  const user = response.data.data[0];
  if (!user) return null;

  return {
    userId: user.id,
    username: user.name,
    displayName: user.displayName,
  };
};

exports.checkUserInGroup = async (userId, groupId) => {
  const response = await axios.get(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
  const groups = response.data.data || [];
  const found = groups.find((item) => String(item.group.id) === String(groupId));
  return { isJoined: !!found, group: found || null };
};
