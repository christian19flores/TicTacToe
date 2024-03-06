import express from 'express';
import { getTopPerformers } from '../models/user.model';

class LeaderboardController {
    /**
     * 
     * Pull Leaderboard for all users, typically top 5
     * /leaderboard
     * 
     * GET:
     * description: Get the top 5 users by wins
     * responses:
     * 200:
     *     description: Leaderboard found
     *    content:
     *          application/json:
     *              schema: object
     *          properties:
     *              id: string
     *              username:string
     *              wins: integer
     *              losses: integer
     *              draws: integer
     * 404:
     *    description: Leaderboard not found
     * 500:
     *   description: Internal Server Error
     * 
     */
    public async getLeaderboard(req: express.Request, res: express.Response) {
        try {

            const leaderboard = await getTopPerformers('wins', 5);

            if (!leaderboard) {
                return res.status(404).json({ message: 'Leaderboard not found' });
            }

            res.status(200).json(leaderboard);
            
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new LeaderboardController();