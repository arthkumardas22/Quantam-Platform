import { prisma } from '../config/db';

export async function getAllTopics(userId?: string) {
  const topics = await prisma.learningTopic.findMany({
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        select: {
          id: true,
          title: true,
          order: true,
          xpReward: true,
          slug: true,
        },
        orderBy: { order: 'asc' },
      },
      progress: userId
        ? {
            where: { userId },
            select: { progress: true, completed: true },
          }
        : false,
    },
  });

  return topics.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    difficulty: t.difficulty,
    estimatedMinutes: t.estimatedMinutes,
    order: t.order,
    slug: t.slug,
    totalLessons: t.lessons.length,
    lessons: t.lessons,
    userProgress: t.progress?.[0] || { progress: 0, completed: false },
  }));
}

export async function getTopicById(idOrSlug: string, userId?: string) {
  const topic = await prisma.learningTopic.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
      progress: userId
        ? {
            where: { userId },
            select: { progress: true, completed: true },
          }
        : false,
    },
  });

  if (!topic) {
    const error: any = new Error('Topic not found.');
    error.status = 404;
    error.code = 'TOPIC_NOT_FOUND';
    throw error;
  }

  return {
    ...topic,
    userProgress: topic.progress?.[0] || { progress: 0, completed: false },
  };
}

export async function getLessonsByTopic(topicIdOrSlug: string) {
  const topic = await getTopicById(topicIdOrSlug);
  return topic.lessons;
}

export async function getLessonById(idOrSlug: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      topic: {
        select: { id: true, title: true, slug: true, category: true },
      },
    },
  });

  if (!lesson) {
    const error: any = new Error('Lesson not found.');
    error.status = 404;
    error.code = 'LESSON_NOT_FOUND';
    throw error;
  }

  return lesson;
}

export async function completeLesson(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { topic: { include: { lessons: true } } },
  });

  if (!lesson) {
    const error: any = new Error('Lesson not found.');
    error.status = 404;
    error.code = 'LESSON_NOT_FOUND';
    throw error;
  }

  // Record lesson progress
  const progressRecord = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      xpEarned: lesson.xpReward,
    },
  });

  // Calculate topic-level progress percentage
  const totalLessons = lesson.topic.lessons.length;
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
      lesson: { topicId: lesson.topicId },
    },
  });

  const topicProgressRatio = totalLessons > 0 ? completedLessons / totalLessons : 1;
  const isTopicCompleted = topicProgressRatio >= 1;

  await prisma.userProgress.upsert({
    where: {
      userId_topicId: { userId, topicId: lesson.topicId },
    },
    update: {
      progress: topicProgressRatio,
      completed: isTopicCompleted,
    },
    create: {
      userId,
      topicId: lesson.topicId,
      progress: topicProgressRatio,
      completed: isTopicCompleted,
    },
  });

  return {
    lessonId,
    xpEarned: lesson.xpReward,
    topicId: lesson.topicId,
    topicProgress: topicProgressRatio,
    topicCompleted: isTopicCompleted,
  };
}

export async function getUserProgressAnalytics(userId: string) {
  const [completedLessons, completedChallenges, simulationsCount, userProgressEntries] =
    await Promise.all([
      prisma.lessonProgress.findMany({
        where: { userId, completed: true },
        include: { lesson: true },
      }),
      prisma.challengeSubmission.findMany({
        where: { userId, passed: true },
        include: { challenge: true },
      }),
      prisma.circuitExecution.count({
        where: { userId },
      }),
      prisma.userProgress.findMany({
        where: { userId },
        include: { topic: true },
      }),
    ]);

  const totalLessonXp = completedLessons.reduce((sum, p) => sum + p.xpEarned, 0);
  const totalChallengeXp = completedChallenges.reduce((sum, c) => sum + c.xpEarned, 0);
  const currentXp = totalLessonXp + totalChallengeXp;
  const level = Math.floor(currentXp / 500) + 1;
  const nextLevelXp = level * 500;

  return {
    level,
    currentXp,
    nextLevelXp,
    streakDays: 4, // Simulated active streak
    completedLessonIds: completedLessons.map((l) => l.lessonId),
    completedChallengeIds: completedChallenges.map((c) => c.challengeId),
    simulationsRun: simulationsCount,
    topicsProgress: userProgressEntries.map((up) => ({
      topicId: up.topicId,
      title: up.topic.title,
      progress: up.progress,
      completed: up.completed,
    })),
    weeklyActivity: [
      { day: 'Mon', simulations: Math.min(simulationsCount, 8), minutes: 35 },
      { day: 'Tue', simulations: Math.min(simulationsCount, 12), minutes: 45 },
      { day: 'Wed', simulations: Math.min(simulationsCount, 6), minutes: 20 },
      { day: 'Thu', simulations: Math.min(simulationsCount, 14), minutes: 50 },
      { day: 'Fri', simulations: Math.min(simulationsCount, 10), minutes: 40 },
      { day: 'Sat', simulations: Math.min(simulationsCount, 18), minutes: 65 },
      { day: 'Sun', simulations: Math.min(simulationsCount, 15), minutes: 55 },
    ],
  };
}
