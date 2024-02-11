const Router = require("express");
const playerRouter = Router();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const { fetchTopPlayers } = require("../Utils/APIIntegration");
const { fetchRatingHistory } = require("../Utils/APIIntegration");
const { ratingHistoryCsv } = require("../Utils/APIIntegration");
const fs = require("fs");

playerRouter.get("/top-players", async (req, res) => {
  try {
    const topPlayerData = await fetchTopPlayers();

    return res.status(200).send({
      message: "Successfully get top player data",
      data: topPlayerData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "error while getting top player data", error });
  }
});

playerRouter.get("/player/:username/rating-history", async (req, res) => {
  try {
    const { username } = req.params;

    const ratingHistory = await fetchRatingHistory(username);
    return res.status(200).send({
      message: "Successfully get rating history data",
      data: ratingHistory,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "error while getting rating history data", error });
  }
});

playerRouter.get("/players/rating-history-csv", async (req, res) => {
  try {
    const records = await ratingHistoryCsv();
    
    if (!records || records.length === 0) {
      return res
        .status(500)
        .send({ message: "No data found for generating CSV" });
    }
    const filePath = path.join("files", "rating-history.csv");
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: "username", title: "Username" },
        { id: "date", title: "Date" },
        { id: "rating", title: "Rating" },
      ],
    });

    await csvWriter.writeRecords(records);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="rating-history.csv"'
    );
     
    return res.status(200).download(filePath)
  } catch (error) {
    return res.status(500).send({
      message: "error while getting create csv file of rating history",
      error,
    });
  }
});

module.exports = playerRouter;
