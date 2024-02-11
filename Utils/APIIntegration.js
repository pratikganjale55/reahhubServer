const axios = require("axios");



const LICHESS_API_URL = "https://lichess.org/api";

const fetchTopPlayers = async () => {
  try {
    const response = await axios.get(
      `${LICHESS_API_URL}/player/top/50/classical`
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching top players:", error.message);
    return null;
  }
};

const fetchRatingHistory = async (user) => {
  try {
    const response = await axios.get(
      `${LICHESS_API_URL}/user/${user}/rating-history`
    );
    const ratingData = await response.data;
    const today = new Date();
    const thirtyDataAgo = new Date();
    thirtyDataAgo.setDate(thirtyDataAgo.getDate() - 30);
    let allRating = [];
    for (let i = 0; i < ratingData.length; i++) {
      allRating.push(...ratingData[i].points);
    }
    const filterDataThirtyDayAgo = allRating.filter((point) => {
      const pointData = new Date(point[0], point[1], point[2]);
      return pointData >= thirtyDataAgo && pointData <= today;
    });
    // console.log(filterDataThirtyDayAgo);

    return filterDataThirtyDayAgo;
  } catch (error) {
    console.error("Error fetching rating history:", error.message);
    return null;
  }
};

const ratingHistoryCsv = async () => {
  try {
    const topPlayer = await fetchTopPlayers();
        const topPlayerData = topPlayer.users;

        const records = [];
        for (let i = 0; i < topPlayerData.length; i++) {
            const ratingHistory = await fetchRatingHistory(topPlayerData[i].username);
            for (const entry of ratingHistory) {
                const [year, month, day, rating] = entry;
                const date = `${year}/${month}/${day}`;
                records.push({
                    username: topPlayerData[i].username,
                    date,
                    rating,
                });
            }
        }
        return records;
  } catch (error) {
    console.error(
      "Error fetching - create CSV file of rating history:",
      error.message
    );
    return null;
  }
};

module.exports = { fetchTopPlayers, fetchRatingHistory, ratingHistoryCsv };
