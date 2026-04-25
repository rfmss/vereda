import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MONTHS_SHORT = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
];

const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

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
  const [plannerData, setPlannerData] = useState({ items: {} });
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const holidays = useMemo(() => getBrazilianHolidays(currentYear), [currentYear]);

  useEffect(() => {
    try {
      if (noteContent && noteContent.trim().startsWith('{')) {
        setPlannerData(JSON.parse(noteContent));
      } else {
        setPlannerData({ items: {} });
      }
    } catch (e) {
      setPlannerData({ items: {} });
    }
  }, [noteContent]);

  const savePlannerData = useCallback((newData) => {
    setPlannerData(newData);
    onUpdateContent(JSON.stringify(newData));
  }, [onUpdateContent]);

  const daysInMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonthIndex, 1);
    const days = [];
    while (date.getMonth() === currentMonthIndex) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentYear, currentMonthIndex]);

  const handleAddItem = (dayKey, type = 'task') => {
    const text = prompt(`Novo ${type === 'task' ? 'item' : 'nota'}:`);
    if (!text) return;
    const newData = { ...plannerData };
    if (!newData.items[dayKey]) newData.items[dayKey] = [];
    newData.items[dayKey].push({ id: Date.now(), text, type, completed: false });
    savePlannerData(newData);
  };

  const toggleItem = (dayKey, itemId) => {
    const newData = { ...plannerData };
    newData.items[dayKey] = newData.items[dayKey].map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    savePlannerData(newData);
  };

  const deleteItem = (dayKey, itemId) => {
    const newData = { ...plannerData };
    newData.items[dayKey] = newData.items[dayKey].filter(item => item.id !== itemId);
    savePlannerData(newData);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-container-max-width mx-auto w-full px-8 py-12">
        
        {/* Header Section */}
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display-lg text-4xl font-semibold text-on-surface">Organize-se em {currentYear}</h2>
          <div className="relative">
            <div 
              className="flex items-center gap-3 bg-surface-container-low px-5 py-2.5 rounded-full border border-surface-variant hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setShowMonthPicker(!showMonthPicker)}
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">calendar_month</span>
              <span className="font-h2 text-h2 text-on-surface text-[18px]">{MONTHS[currentMonthIndex]}</span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">expand_more</span>
            </div>
            {showMonthPicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-50 p-2 animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-1">
                  {MONTHS.map((m, i) => (
                    <button 
                      key={m} 
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${i === currentMonthIndex ? 'bg-primary text-white' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'}`}
                      onClick={() => { setCurrentMonthIndex(i); setShowMonthPicker(false); }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Month Ruler (Heatmap) */}
        <div className="flex justify-between items-center mb-16 px-6 py-8 bg-white dark:bg-stone-950 rounded-2xl border border-surface-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          {MONTHS_SHORT.map((m, i) => {
            const hasItems = Object.keys(plannerData.items || {}).some(k => k.startsWith(`${currentYear}-${String(i+1).padStart(2, '0')}`));
            return (
              <div 
                key={m} 
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${i === currentMonthIndex ? 'text-primary dark:text-emerald-500 scale-110' : 'opacity-40 hover:opacity-100'}`}
                onClick={() => setCurrentMonthIndex(i)}
              >
                <span className="font-label-caps text-[10px] font-bold tracking-widest">{m}</span>
                <div className="flex gap-[2px]">
                  <div className={`w-1.5 h-1.5 rounded-full ${i === currentMonthIndex ? 'bg-primary' : hasItems ? 'bg-primary/40' : 'bg-surface-variant'}`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Spine Timeline */}
        <div className="relative pl-10 before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-12 before:w-[1px] before:bg-stone-200 dark:before:bg-stone-800">
          {daysInMonth.map(date => {
            const dayNum = date.getDate();
            const dayName = WEEKDAYS[date.getDay()];
            const dayKey = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const holiday = holidays[`${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`];
            const items = plannerData.items[dayKey] || [];
            const isToday = TODAY.toDateString() === date.toDateString();

            return (
              <div key={dayKey} className="relative mb-12 group animate-in slide-in-from-left-2 duration-500">
                {/* Dot */}
                <div className={`absolute -left-[30px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 z-10 transition-all ${isToday ? 'border-primary scale-125' : 'border-stone-300 dark:border-stone-700 group-hover:border-primary'}`}></div>
                
                <div className="flex items-baseline gap-4 mb-4">
                  <span className={`font-h2 text-2xl font-bold ${isToday ? 'text-primary dark:text-emerald-500' : 'text-on-surface'}`}>{dayNum}</span>
                  <span className="font-helper-text text-sm text-stone-400 flex items-center gap-3">
                    {dayName}
                    {holiday && (
                      <span className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border border-orange-200 dark:border-orange-900/50">
                        {holiday}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className={`group/item flex items-center gap-4 px-5 py-3 rounded-2xl w-max min-w-[280px] border transition-all cursor-pointer ${item.completed ? 'bg-stone-50 dark:bg-stone-900/50 border-transparent opacity-60' : item.type === 'task' ? 'bg-primary/5 dark:bg-emerald-500/5 border-primary/10 hover:border-primary/30' : 'bg-orange-50 dark:bg-orange-900/5 border-orange-200/50 hover:border-orange-300'}`}
                      onClick={() => toggleItem(dayKey, item.id)}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {item.completed ? 'check_circle' : 'circle'}
                      </span>
                      <span className={`font-body-ui text-sm flex-1 ${item.completed ? 'line-through text-stone-400' : 'text-on-surface'}`}>
                        {item.text}
                      </span>
                      <button 
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity text-stone-300 hover:text-red-500"
                        onClick={(e) => { e.stopPropagation(); deleteItem(dayKey, item.id); }}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-primary/5 hover:text-primary transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                      onClick={() => handleAddItem(dayKey, 'task')}
                    >
                      <Plus size={14} /> Tarefa
                    </button>
                    <button 
                      className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-orange-500/5 hover:text-orange-500 transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                      onClick={() => handleAddItem(dayKey, 'note')}
                    >
                      <Plus size={14} /> Nota
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
