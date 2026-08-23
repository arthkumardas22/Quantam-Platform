'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/types/learning';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface UserContextType {
  progress: UserProgress;
  addXp: (amount: number, reason?: string) => void;
  markLessonCompleted: (lessonId: string, xpEarned: number) => void;
  markChallengeCompleted: (challengeId: string, xpEarned: number) => void;
  incrementSimulationCount: () => void;
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_PROGRESS: UserProgress = {
  level: 3,
  currentXp: 450,
  nextLevelXp: 800,
  streakDays: 7,
  algorithmsMastered: 4,
  totalAlgorithms: 6,
  challengesCompleted: 3,
  totalChallenges: 4,
  simulationsRun: 42,
  timeSpentMinutes: 185,
  completedLessonIds: ['lesson_1', 'lesson_2'],
  completedChallengeIds: ['ch_1'],
  badges: [
    {
      id: 'badge_superposition',
      name: 'Superposition Pioneer',
      description: 'Mastered single-qubit states and Hadamard interference.',
      icon: 'Atom',
      unlockedAt: '2026-08-15',
    },
    {
      id: 'badge_entangled',
      name: 'Entanglement Architect',
      description: 'Successfully synthesized all four canonical Bell States.',
      icon: 'Link',
      unlockedAt: '2026-08-18',
    },
    {
      id: 'badge_grover',
      name: 'Quantum Oracle Hunter',
      description: 'Implemented quadratic search with phase amplification.',
      icon: 'Search',
      unlockedAt: '2026-08-20',
    },
    {
      id: 'badge_teleport',
      name: 'Quantum Teleporter',
      description: 'Transmitted arbitrary qubit state over 2 classical bits.',
      icon: 'Send',
    },
  ],
  weeklyActivity: [
    { day: 'Mon', simulations: 6, minutes: 25 },
    { day: 'Tue', simulations: 12, minutes: 40 },
    { day: 'Wed', simulations: 4, minutes: 15 },
    { day: 'Thu', simulations: 18, minutes: 50 },
    { day: 'Fri', simulations: 9, minutes: 30 },
    { day: 'Sat', simulations: 14, minutes: 45 },
    { day: 'Sun', simulations: 8, minutes: 20 },
  ],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quantum_user_progress');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROGRESS;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quantum_user_progress', JSON.stringify(progress));
    }
  }, [progress]);

  const showToast = useCallback((toastData: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toastData, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addXp = useCallback(
    (amount: number, reason?: string) => {
      setProgress((prev) => {
        let newXp = prev.currentXp + amount;
        let newLevel = prev.level;
        let nextTarget = prev.nextLevelXp;

        if (newXp >= nextTarget) {
          newLevel += 1;
          newXp -= nextTarget;
          nextTarget = Math.round(nextTarget * 1.5);
          showToast({
            type: 'success',
            title: `🌟 Level Up! Reached Level ${newLevel}!`,
            message: 'You unlocked new quantum algorithm modules & studio gates.',
          });
        }

        return {
          ...prev,
          level: newLevel,
          currentXp: newXp,
          nextLevelXp: nextTarget,
        };
      });

      if (reason) {
        showToast({
          type: 'info',
          title: `+${amount} XP Earned`,
          message: reason,
        });
      }
    },
    [showToast]
  );

  const markLessonCompleted = useCallback(
    (lessonId: string, xpEarned: number) => {
      setProgress((prev) => {
        if (prev.completedLessonIds.includes(lessonId)) return prev;
        return {
          ...prev,
          completedLessonIds: [...prev.completedLessonIds, lessonId],
        };
      });
      addXp(xpEarned, 'Completed Interactive Lesson Module');
    },
    [addXp]
  );

  const markChallengeCompleted = useCallback(
    (challengeId: string, xpEarned: number) => {
      setProgress((prev) => {
        if (prev.completedChallengeIds.includes(challengeId)) return prev;
        return {
          ...prev,
          challengesCompleted: prev.challengesCompleted + 1,
          completedChallengeIds: [...prev.completedChallengeIds, challengeId],
        };
      });
      addXp(xpEarned, 'Solved Quantum Circuit Challenge');
    },
    [addXp]
  );

  const incrementSimulationCount = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      simulationsRun: prev.simulationsRun + 1,
    }));
  }, []);

  return (
    <UserContext.Provider
      value={{
        progress,
        addXp,
        markLessonCompleted,
        markChallengeCompleted,
        incrementSimulationCount,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
