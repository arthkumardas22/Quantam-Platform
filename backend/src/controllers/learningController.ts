import { Request, Response, NextFunction } from 'express';
import * as learningService from '../services/learningService';
import { sendSuccess } from '../utils/responseFormatter';

export async function getTopics(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const topics = await learningService.getAllTopics(userId);
    return sendSuccess(res, topics);
  } catch (err) {
    next(err);
  }
}

export async function getTopic(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const topic = await learningService.getTopicById(id, userId);
    return sendSuccess(res, topic);
  } catch (err) {
    next(err);
  }
}

export async function getLessons(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const lessons = await learningService.getLessonsByTopic(id);
    return sendSuccess(res, lessons);
  } catch (err) {
    next(err);
  }
}

export async function getLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const lesson = await learningService.getLessonById(id);
    return sendSuccess(res, lesson);
  } catch (err) {
    next(err);
  }
}

export async function completeLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const result = await learningService.completeLesson(id, userId);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const analytics = await learningService.getUserProgressAnalytics(userId);
    return sendSuccess(res, analytics);
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const analytics = await learningService.getUserProgressAnalytics(userId);
    return sendSuccess(res, analytics);
  } catch (err) {
    next(err);
  }
}
