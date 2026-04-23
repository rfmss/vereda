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
    <div className="editor-stats">
      <div className="stats-group">
        <span className="stat-item"><b>{stats.words}</b> palavras</span>
        <span className="stat-item"><b>{stats.chars}</b> caracteres</span>
        <span className="stat-item"><b>{stats.readTime}</b> min de leitura</span>
      </div>
      
      <div className="stats-meta">
        {goal > 0 && (
          <div className="goal-progress-mini">
            <div className="goal-progress-bar" style={{ width: `${progress}%`, backgroundColor: isGoalReached ? '#10b981' : 'var(--accent)' }} />
          </div>
        )}
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
                <div className="human-score-pill">
                  {isGoalReached ? <CheckCircle2 size={12} /> : <Target size={12} />}
                  <span>{stats.words} / {goal} meta</span>
                </div>
              ) : (
                <div className="human-score-pill">
                  <Target size={12} />
                  <span>Definir Meta</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
