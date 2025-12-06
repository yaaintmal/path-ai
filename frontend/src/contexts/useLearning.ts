import { useContext } from 'react';
import LearningContext, { type LearningContextType } from './LearningContext';

export function useLearning(): LearningContextType {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within LearningProvider');
  }
  return context;
}
