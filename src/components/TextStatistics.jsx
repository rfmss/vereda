import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Target, CheckCircle2 } from 'lucide-react';

export function TextStatistics({ text, goal = 0, onSetGoal }) {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal.toString());
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const getStats = () => {
    if (!text) return { words: 0, chars: 0, readTime: 0 };
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readTime };
  };

  const stats = getStats();
  const progress = goal > 0 ? Math.min(100, (stats.words / goal) * 100) : 0;
  const isGoalReached = goal > 0 && stats.words >= goal;

  // Trigger confetti when goal is reached for the first time
  useEffect(() => {
    if (isGoalReached && !hasCelebrated) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#da7b5f', '#e59c85', '#28a745', '#ff7b72']
      });
      setHasCelebrated(true);
    } else if (!isGoalReached && hasCelebrated) {
      setHasCelebrated(false); // Reset if they delete words
    }
  }, [stats.words, goal, isGoalReached, hasCelebrated]);

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const newGoal = parseInt(tempGoal, 10);
    if (!isNaN(newGoal)) {
      onSetGoal(newGoal);
    }
    setIsEditingGoal(false);
  };

  return (
    <div className="text-statistics-wrapper">
      {goal > 0 && (
        <div className="goal-progress-container">
          <div className="goal-progress-bar" style={{ width: `${progress}%`, backgroundColor: isGoalReached ? '#28a745' : 'var(--accent)' }} />
        </div>
      )}
      <div className="text-statistics-bar">
        <span>{stats.words} palavras</span>
        <span>•</span>
        <span>{stats.chars} caracteres</span>
        <span>•</span>
        <span>~{stats.readTime} min de leitura</span>
        
        <div className="goal-section">
          {isEditingGoal ? (
            <form onSubmit={handleGoalSubmit} className="goal-form">
              <input 
                type="number" 
                value={tempGoal} 
                onChange={(e) => setTempGoal(e.target.value)} 
                autoFocus
                onBlur={handleGoalSubmit}
                className="goal-input"
              />
            </form>
          ) : (
            <button className={`goal-btn ${isGoalReached ? 'reached' : ''}`} onClick={() => setIsEditingGoal(true)} data-tooltip="Definir meta diária">
              {goal > 0 ? (
                <>
                  {isGoalReached ? <CheckCircle2 size={14} /> : <Target size={14} />}
                  <span>{stats.words} / {goal}</span>
                </>
              ) : (
                <>
                  <Target size={14} />
                  <span>Meta</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
