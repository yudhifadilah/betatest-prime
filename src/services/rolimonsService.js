const axios = require('axios');

exports.checkRolimonsPlayer = async (username) => {
  try {
    const url = `https://www.rolimons.com/player/${encodeURIComponent(username)}`;
    const response = await axios.get(url, { timeout: 10000 });
    return {
      success: response.status === 200,
      username,
      isFound: response.status === 200,
      message: 'Player ditemukan di Rolimons',
    };
  } catch (error) {
    return {
      success: false,
      username,
      isFound: false,
      message: 'Gagal mengecek Rolimons atau player tidak ditemukan',
    };
  }
};
