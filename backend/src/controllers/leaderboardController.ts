import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const topPlayers = await prisma.leaderboard.findMany({
      orderBy: { time: 'asc' },
      take: 10,
    });

    res.json(topPlayers);
  } catch (error) {
    console.error('[GET] Leaderboard error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const submitScore = async (req: Request, res: Response) => {
  try {
    const { initials, time } = req.body;

    if (!initials || initials.length !== 3 || typeof time !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const newEntry = await prisma.leaderboard.create({
      data: {
        initials: initials.toUpperCase(),
        time,
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('[POST] Submit score error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
