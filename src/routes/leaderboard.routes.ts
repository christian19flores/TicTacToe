import express from "express";
import LeaderboardController from "../controllers/leaderboard.controller";

const routes = express.Router();

routes.route("/").get(LeaderboardController.getLeaderboard);

export default routes;