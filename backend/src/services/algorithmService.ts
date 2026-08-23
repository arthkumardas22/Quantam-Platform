import { prisma } from '../config/db';

export async function getAllAlgorithms() {
  return prisma.algorithm.findMany({
    orderBy: { year: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      subtitle: true,
      description: true,
      purpose: true,
      category: true,
      difficulty: true,
      inventor: true,
      year: true,
      speedupType: true,
      classicalComplexity: true,
      quantumComplexity: true,
      defaultPresetId: true,
    },
  });
}

export async function getAlgorithmById(idOrSlug: string) {
  const algo = await prisma.algorithm.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      challenges: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          xp: true,
        },
      },
    },
  });

  if (!algo) {
    const error: any = new Error('Algorithm not found.');
    error.status = 404;
    error.code = 'ALGORITHM_NOT_FOUND';
    throw error;
  }

  return algo;
}

export async function getAlgorithmChallenges(idOrSlug: string) {
  const algo = await getAlgorithmById(idOrSlug);
  return algo.challenges;
}
