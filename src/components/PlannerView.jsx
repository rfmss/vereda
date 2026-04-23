import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon } from 'lucide-react';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const COLORS = [
  { id: 'yellow', hex: '#fde68a', label: 'Âmbar' },
  { id: 'pink',   hex: '#fbcfe8', label: 'Rosa' },
  { id: 'blue',   hex: '#bfdbfe', label: 'Azul' },
  { id: 'green',  hex: '#bbf7d0', label: 'Verde' },
  { id: 'purple', hex: '#e9d5ff', label: 'Lilás' },
];

const TODAY = new Date();

// Feriados Nacionais Brasileiros (Fixos)
const FIXED_HOLIDAYS = {
  '01-01': 'Confraternização Universal',
  '21-04': 'Tiradentes',
  '01-05': 'Dia do Trabalhador',
  '07-09': 'Independência do Brasil',
  '12-10': 'Nossa Senhora Aparecida',
  '02-11': 'Finados',
  '15-11': 'Proclamação da República',
  '20-11': 'Dia da Consciência Negra',
  '25-12': 'Natal'
};

function getEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getBrazilianHolidays(year) {
  const holidays = { ...FIXED_HOLIDAYS };
  const easter = getEaster(year);
  
  const addMoveable = (days, name) => {
    const d = new Date(easter);
    d.setDate(d.getDate() + days);
    const key = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    holidays[key] = name;
  };

  addMoveable(-47, 'Carnaval');
  addMoveable(-2, 'Sexta-feira Santa');
  addMoveable(60, 'Corpus Christi');
  
  return holidays;
}

export function PlannerView({ noteContent, onUpdateContent }) {
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(TODAY.getMonth());
  const [plannerData, setPlannerData] = useState({ notes: {}, monthlyGoals: {} });
  const [activeDate, setActiveDate] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [draftNote, setDraftNote] = useState({ text: '', color: 'yellow' });
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const holidays = useMemo(() => getBrazilianHolidays(currentYear), [currentYear]);

  // Parse data from note content
  useEffect(() => {
    try {
      if (noteContent && noteContent.trim().startsWith('{')) {
        const parsed = JSON.parse(noteContent);
        // Migração simples se for formato antigo (apenas notas no root)
        if (!parsed.notes && !parsed.monthlyGoals) {
          setPlannerData({ notes: parsed, monthlyGoals: {} });
        } else {
          setPlannerData(parsed);
        }
      } else {
        setPlannerData({ notes: {}, monthlyGoals: {} });
      }
    } catch (e) {
      setPlannerData({ notes: {}, monthlyGoals: {} });
    }
  }, [noteContent]);

  const savePlannerData = useCallback((newData) => {
    setPlannerData(newData);
    onUpdateContent(JSON.stringify(newData));
  }, [onUpdateContent]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isCurrentMonth: false, dateStr: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const padMonth = String(currentMonthIndex + 1).padStart(2, '0');
      const padDay = String(i).padStart(2, '0');
      days.push({
        day: i,
        isCurrentMonth: true,
        dateStr: `${currentYear}-${padMonth}-${padDay}`,
        holiday: holidays[`${padMonth}-${padDay}`]
      });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        days.push({ day: null, isCurrentMonth: false, dateStr: null });
      }
    }

    return days;
  }, [currentMonthIndex, currentYear, holidays]);

  const todayStr = TODAY.toISOString().split('T')[0];

  const handleAddNote = useCallback(() => {
    if (!draftNote.text.trim() || !activeDate) return;

    const newData = { ...plannerData, notes: { ...plannerData.notes } };
    const dayNotes = [...(newData.notes[activeDate] || [])];

    if (editingNoteId) {
      const idx = dayNotes.findIndex(n => n.id === editingNoteId);
      if (idx > -1) {
        dayNotes[idx] = { ...dayNotes[idx], text: draftNote.text, color: draftNote.color };
      }
    } else {
      dayNotes.push({
        id: Date.now().toString(),
        text: draftNote.text.trim(),
        color: draftNote.color
      });
    }

    newData.notes[activeDate] = dayNotes;
    savePlannerData(newData);
    setDraftNote({ text: '', color: 'yellow' });
    setActiveDate(null);
    setEditingNoteId(null);
  }, [draftNote, activeDate, editingNoteId, plannerData, savePlannerData]);

  const handleDeleteNote = useCallback((e, dateStr, noteId) => {
    e.stopPropagation();
    const updatedNotes = (plannerData.notes[dateStr] || []).filter(n => n.id !== noteId);
    const newData = { ...plannerData, notes: { ...plannerData.notes } };
    if (updatedNotes.length > 0) {
      newData.notes[dateStr] = updatedNotes;
    } else {
      delete newData.notes[dateStr];
    }
    savePlannerData(newData);
  }, [plannerData, savePlannerData]);

  const handleAddGoal = useCallback(() => {
    if (!newGoalText.trim()) return;
    const monthKey = `${currentYear}-${currentMonthIndex}`;
    const newGoal = { id: Date.now().toString(), text: newGoalText.trim(), completed: false };
    
    const newData = {
      ...plannerData,
      monthlyGoals: {
        ...plannerData.monthlyGoals,
        [monthKey]: [...(plannerData.monthlyGoals[monthKey] || []), newGoal]
      }
    };
    
    savePlannerData(newData);
    setNewGoalText('');
    setShowGoalInput(false);
  }, [newGoalText, currentMonthIndex, currentYear, plannerData, savePlannerData]);

  const toggleGoal = useCallback((goalId) => {
    const monthKey = `${currentYear}-${currentMonthIndex}`;
    const updatedGoals = (plannerData.monthlyGoals[monthKey] || []).map(g => 
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    
    savePlannerData({
      ...plannerData,
      monthlyGoals: { ...plannerData.monthlyGoals, [monthKey]: updatedGoals }
    });
  }, [currentMonthIndex, currentYear, plannerData, savePlannerData]);

  const deleteGoal = useCallback((goalId) => {
    const monthKey = `${currentYear}-${currentMonthIndex}`;
    const updatedGoals = (plannerData.monthlyGoals[monthKey] || []).filter(g => g.id !== goalId);
    
    savePlannerData({
      ...plannerData,
      monthlyGoals: { ...plannerData.monthlyGoals, [monthKey]: updatedGoals }
    });
  }, [currentMonthIndex, currentYear, plannerData, savePlannerData]);

  const handleDayClick = useCallback((cell) => {
    if (!cell.isCurrentMonth) return;
    setActiveDate(prev => prev === cell.dateStr ? null : cell.dateStr);
    setDraftNote({ text: '', color: 'yellow' });
    setEditingNoteId(null);
  }, []);

  const handleEditNote = useCallback((e, dateStr, note) => {
    e.stopPropagation();
    setActiveDate(dateStr);
    setEditingNoteId(note.id);
    setDraftNote({ text: note.text, color: note.color });
  }, []);

  // Count notes in a month for the strip
  const notesCountByMonth = useMemo(() => {
    const counts = Array(12).fill(0);
    Object.keys(plannerData.notes || {}).forEach(dateStr => {
      const parts = dateStr.split('-');
      if (parts.length === 3 && parseInt(parts[0], 10) === currentYear) {
        const month = parseInt(parts[1], 10) - 1;
        counts[month] += (plannerData.notes[dateStr] || []).length;
      }
    });
    return counts;
  }, [plannerData.notes, currentYear]);

  const currentMonthGoals = useMemo(() => {
    return plannerData.monthlyGoals?.[`${currentYear}-${currentMonthIndex}`] || [];
  }, [plannerData.monthlyGoals, currentMonthIndex, currentYear]);

  return (
    <div className="planner-container">
      {/* Header */}
      <div className="planner-header">
        <div className="planner-title">
          <CalendarIcon size={22} strokeWidth={1.5} />
          <div className="planner-year-selector">
            <button onClick={() => setCurrentYear(y => y - 1)} disabled={currentYear <= 2026} className="year-btn">
              <ChevronLeft size={14} />
            </button>
            <h1>Planner {currentYear}</h1>
            <button onClick={() => setCurrentYear(y => y + 1)} disabled={currentYear >= 2030} className="year-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="planner-month-selector">
          <button
            className="icon-btn"
            onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
            disabled={currentMonthIndex === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <h2>{MONTHS[currentMonthIndex]}</h2>
          <button
            className="icon-btn"
            onClick={() => setCurrentMonthIndex(prev => Math.min(11, prev + 1))}
            disabled={currentMonthIndex === 11}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Month strip for quick navigation */}
      <div className="planner-months-strip">
        {MONTHS_SHORT.map((m, i) => {
          const count = notesCountByMonth[i];
          const intensity = Math.min(count * 20, 100); // Heatmap logic
          return (
            <button
              key={m}
              className={`planner-month-pill ${currentMonthIndex === i ? 'active' : ''}`}
              onClick={() => setCurrentMonthIndex(i)}
              title={`${count} anotação(ões) em ${MONTHS[i]}`}
            >
              {m}
              {count > 0 && (
                <span className="month-heatmap-dot" style={{ opacity: intensity / 100 + 0.3 }} />
              )}
            </button>
          );
        })}
      </div>

      <div className="planner-main-content">
        <div className="planner-calendar-section">
          {/* Weekday headers */}
          <div className="planner-weekdays">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="planner-grid" onClick={() => { setActiveDate(null); setEditingNoteId(null); }}>
            {calendarDays.map((cell, index) => {
              const isToday = cell.dateStr === todayStr;
              const notes = cell.dateStr ? (plannerData.notes[cell.dateStr] || []) : [];
              const isActive = activeDate === cell.dateStr;

              return (
                <div
                  key={index}
                  className={[
                    'planner-day',
                    !cell.isCurrentMonth ? 'planner-day-empty' : '',
                    isToday ? 'planner-day-today' : '',
                    isActive ? 'planner-day-active' : '',
                    cell.holiday ? 'planner-day-holiday' : ''
                  ].join(' ')}
                  onClick={(e) => { e.stopPropagation(); handleDayClick(cell); }}
                >
                  {cell.isCurrentMonth && (
                    <>
                      <div className="planner-day-header">
                        <span className="planner-day-number">{cell.day}</span>
                        <button
                          className="planner-day-add"
                          onClick={(e) => { e.stopPropagation(); setActiveDate(cell.dateStr); setDraftNote({ text: '', color: 'yellow' }); setEditingNoteId(null); }}
                          title="Adicionar anotação"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {cell.holiday && (
                        <div className="planner-holiday-label" title={cell.holiday}>
                          {cell.holiday}
                        </div>
                      )}

                      <div className="planner-day-events">
                        {notes.map(note => (
                          <div 
                            key={note.id} 
                            className={`event-pill event-pill-${note.color}`} 
                            onClick={(e) => handleEditNote(e, cell.dateStr, note)}
                          >
                            <span className="event-pill-text">{note.text}</span>
                            <button
                              className="event-pill-delete"
                              onClick={(e) => handleDeleteNote(e, cell.dateStr, note.id)}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Popover */}
                      {isActive && (
                        <div className="planner-popover" onClick={e => e.stopPropagation()}>
                          <div className="planner-popover-header">
                            <h3>
                              {editingNoteId ? 'Editar Anotação' : `${cell.day} de ${MONTHS[currentMonthIndex]}`}
                            </h3>
                            <button className="icon-btn" onClick={() => { setActiveDate(null); setEditingNoteId(null); }}>
                              <X size={15} />
                            </button>
                          </div>
                          <textarea
                            autoFocus
                            placeholder="Meta, compromisso ou ideia…"
                            value={draftNote.text}
                            onChange={e => setDraftNote(d => ({ ...d, text: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddNote();
                              }
                              if (e.key === 'Escape') { setActiveDate(null); setEditingNoteId(null); }
                            }}
                          />
                          <div className="planner-popover-footer">
                            <div className="planner-color-picker">
                              {COLORS.map(c => (
                                <button
                                  key={c.id}
                                  className={`color-swatch ${draftNote.color === c.id ? 'active' : ''}`}
                                  style={{ backgroundColor: c.hex }}
                                  onClick={() => setDraftNote(d => ({ ...d, color: c.id }))}
                                  title={c.label}
                                />
                              ))}
                            </div>
                            <button className="primary-btn" onClick={handleAddNote}>
                              {editingNoteId ? 'Atualizar' : 'Salvar'}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Goals Sidebar */}
        <div className="planner-goals-sidebar">
          <div className="goals-header">
            <h3>Metas de {MONTHS[currentMonthIndex]}</h3>
            <button className="icon-btn" onClick={() => setShowGoalInput(true)}>
              <Plus size={16} />
            </button>
          </div>
          
          <div className="goals-list">
            {showGoalInput && (
              <div className="goal-input-wrapper">
                <input
                  autoFocus
                  placeholder="Nova meta mensal..."
                  value={newGoalText}
                  onChange={e => setNewGoalText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddGoal();
                    if (e.key === 'Escape') setShowGoalInput(false);
                  }}
                />
                <div className="goal-input-actions">
                  <button className="goal-cancel" onClick={() => setShowGoalInput(false)}>Cancelar</button>
                  <button className="goal-save" onClick={handleAddGoal}>OK</button>
                </div>
              </div>
            )}
            
            {currentMonthGoals.length === 0 && !showGoalInput ? (
              <p className="goals-empty">Nenhuma meta definida para este mês.</p>
            ) : (
              currentMonthGoals.map(goal => (
                <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoal(goal.id)}
                  />
                  <span>{goal.text}</span>
                  <button onClick={() => deleteGoal(goal.id)} className="goal-delete">
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
