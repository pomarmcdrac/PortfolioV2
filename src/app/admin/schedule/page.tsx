"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  Loader2,
  Settings,
  Coffee,
} from "lucide-react";
import {
  getScheduleConfig,
  updateScheduleConfig,
  getBlockedDates,
  createBlockedDate,
  deleteBlockedDate,
} from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ScheduleAdminPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [config, setConfig] = useState({
    workDays: [] as number[],
    startHour: "09:00",
    endHour: "17:00",
    interval: 30,
    breaks: [] as { start: string; end: string }[],
  });

  // Separate state for blocked dates with IDs
  const [blockedDates, setBlockedDates] = useState<
    Array<{ id: string; date: string; reason?: string }>
  >([]);

  const [blockedDateInput, setBlockedDateInput] = useState("");
  const [breakInput, setBreakInput] = useState({ start: "", end: "" });

  const daysOfWeek = [
    { id: 0, label: "Domingo", short: "DOM" },
    { id: 1, label: "Lunes", short: "LUN" },
    { id: 2, label: "Martes", short: "MAR" },
    { id: 3, label: "Miércoles", short: "MIE" },
    { id: 4, label: "Jueves", short: "JUE" },
    { id: 5, label: "Viernes", short: "VIE" },
    { id: 6, label: "Sábado", short: "SAB" },
  ];

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    setLoading(true);
    try {
      const [configData, blockedDatesData] = await Promise.all([
        getScheduleConfig(),
        getBlockedDates(),
      ]);

      if (configData) {
        setConfig({
          workDays: configData.workDays || [1, 2, 3, 4, 5],
          startHour: configData.startHour || "09:00",
          endHour: configData.endHour || "17:00",
          interval: configData.interval || 30,
          breaks: configData.breaks || [],
        });
      }

      setBlockedDates(blockedDatesData || []);
    } catch (error) {
      console.error("Failed to load config");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const success = await updateScheduleConfig(config);
      if (success) {
        setStatus({
          type: "success",
          message: t.admin.schedule.success,
        });
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({
          type: "error",
          message: t.admin.schedule.error,
        });
      }
    } catch (error) {
      setStatus({ type: "error", message: t.admin.schedule.connectionError });
    } finally {
      setSaving(false);
    }
  }

  const toggleDay = (dayId: number) => {
    setConfig((prev) => {
      const exists = prev.workDays.includes(dayId);
      if (exists) {
        return { ...prev, workDays: prev.workDays.filter((d) => d !== dayId) };
      } else {
        return { ...prev, workDays: [...prev.workDays, dayId].sort() };
      }
    });
  };

  const addBlockedDate = async () => {
    if (!blockedDateInput) return;
    if (blockedDates.some((d) => d.date === blockedDateInput)) {
      setBlockedDateInput("");
      return;
    }

    try {
      const success = await createBlockedDate({ date: blockedDateInput });
      if (success) {
        // Reload to get the new ID from backend
        await loadConfig();
        setBlockedDateInput("");
        setStatus({
          type: "success",
          message: "Fecha bloqueada agregada",
        });
        setTimeout(() => setStatus(null), 2000);
      } else {
        setStatus({
          type: "error",
          message: "Error al agregar fecha bloqueada",
        });
      }
    } catch (error) {
      console.error("Error adding blocked date:", error);
    }
  };

  const addBreak = () => {
    if (!breakInput.start || !breakInput.end) return;
    setConfig((prev) => ({
      ...prev,
      breaks: [...prev.breaks, breakInput],
    }));
    setBreakInput({ start: "", end: "" });
  };

  const removeBreak = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((_, i) => i !== index),
    }));
  };

  const removeBlockedDate = async (id: string) => {
    try {
      const success = await deleteBlockedDate(id);
      if (success) {
        setBlockedDates((prev) => prev.filter((d) => d.id !== id));
        setStatus({
          type: "success",
          message: "Fecha bloqueada eliminada",
        });
        setTimeout(() => setStatus(null), 2000);
      } else {
        setStatus({
          type: "error",
          message: "Error al eliminar fecha bloqueada",
        });
      }
    } catch (error) {
      console.error("Error removing blocked date:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="spinner" size={48} />
        <p>{t.admin.schedule.loading}</p>
        <style jsx>{`
          .loading-container {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.5);
            gap: 1rem;
          }
          .spinner {
            animation: spin 1s linear infinite;
            color: var(--color-primary);
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="schedule-admin">
      <header className="page-header">
        <div className="header-content">
          <div className="icon-box">
            <Settings size={28} />
          </div>
          <div>
            <h1>{t.admin.schedule.title}</h1>
            <p>{t.admin.schedule.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="grid-container">
        {/* Configuración General */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div className="card-header">
            <Clock className="card-icon" />
            <h2>{t.admin.schedule.generalTitle}</h2>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>{t.admin.schedule.startHour}</label>
              <div className="custom-input">
                <input
                  type="time"
                  value={config.startHour}
                  onChange={(e) =>
                    setConfig({ ...config, startHour: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="input-group">
              <label>{t.admin.schedule.endHour}</label>
              <div className="custom-input">
                <input
                  type="time"
                  value={config.endHour}
                  onChange={(e) =>
                    setConfig({ ...config, endHour: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label>{t.admin.schedule.interval}</label>
              <div className="custom-select">
                <select
                  value={config.interval}
                  onChange={(e) =>
                    setConfig({ ...config, interval: Number(e.target.value) })
                  }
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Días Laborables */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <div className="card-header">
            <CalendarDays className="card-icon purple" />
            <h2>{t.admin.schedule.workDaysTitle}</h2>
          </div>

          <div className="days-grid">
            {daysOfWeek.map((day) => {
              const isActive = config.workDays.includes(day.id);
              return (
                <motion.button
                  key={day.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDay(day.id)}
                  className={`day-card ${isActive ? "active" : ""}`}
                >
                  <div className="day-indicator" />
                  <span className="day-label">{day.short}</span>
                  <span className="day-full">{day.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Breaks / Descansos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card"
        >
          <div className="card-header">
            <Coffee className="card-icon" style={{ color: "#eab308" }} />
            <h2>{t.admin.schedule.breaksTitle}</h2>
          </div>

          <div className="blocked-dates-container">
            <div className="add-date-row">
              <div
                className="custom-input date-input-wrapper"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <input
                  type="time"
                  value={breakInput.start}
                  onChange={(e) =>
                    setBreakInput({ ...breakInput, start: e.target.value })
                  }
                  placeholder={t.admin.schedule.breakStart}
                />
                <span style={{ alignSelf: "center" }}>-</span>
                <input
                  type="time"
                  value={breakInput.end}
                  onChange={(e) =>
                    setBreakInput({ ...breakInput, end: e.target.value })
                  }
                  placeholder={t.admin.schedule.breakEnd}
                />
              </div>
              <button
                onClick={addBreak}
                disabled={!breakInput.start || !breakInput.end}
                className="btn-add"
                style={{
                  color: "#eab308",
                  borderColor: "rgba(234, 179, 8, 0.3)",
                  background: "rgba(234, 179, 8, 0.1)",
                }}
              >
                <Plus size={18} /> {t.admin.schedule.addBreak}
              </button>
            </div>

            <div className="dates-list">
              <AnimatePresence>
                {config.breaks.map((brk, index) => (
                  <motion.div
                    key={`${brk.start}-${brk.end}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="date-tag"
                  >
                    <Clock size={14} style={{ margin: "0px 8px 0px 8px" }} />
                    <span>
                      {brk.start} - {brk.end}
                    </span>
                    <button
                      onClick={() => removeBreak(index)}
                      className="tag-remove"
                    >
                      <XCircle size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {config.breaks.length === 0 && (
                <div className="empty-state">
                  <p>{t.admin.schedule.noBreaks}</p>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Fechas Bloqueadas */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card full-span"
        >
          <div className="card-header">
            <XCircle className="card-icon red" />
            <h2>{t.admin.schedule.blockedDatesTitle}</h2>
          </div>

          <div className="blocked-dates-container">
            <div className="add-date-row">
              <div className="custom-input date-input-wrapper">
                <input
                  type="date"
                  value={blockedDateInput}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBlockedDateInput(e.target.value)}
                />
              </div>
              <button
                onClick={addBlockedDate}
                disabled={!blockedDateInput}
                className="btn-add"
              >
                <Plus size={18} /> {t.admin.schedule.addDate}
              </button>
            </div>

            <div className="dates-grid-layout">
              <AnimatePresence>
                {[...blockedDates]
                  .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
                  .map((blockedDate) => {
                    let displayDate = blockedDate.date;

                    try {
                      if (blockedDate.date) {
                        // Tomamos solo la parte de la fecha (YYYY-MM-DD) para evitar conflictos de formato
                        const datePart = blockedDate.date.split("T")[0];
                        const dateObj = new Date(datePart + "T12:00:00");

                        if (!isNaN(dateObj.getTime())) {
                          displayDate = dateObj.toLocaleDateString(
                            language === "ES" ? "es-ES" : "en-US",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          );
                        }
                      }
                    } catch (e) {
                      console.error("Error formatting date:", e);
                    }

                    return (
                      <motion.div
                        key={blockedDate.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="date-card-premium"
                      >
                        <div className="date-card-main">
                          <div className="date-card-icon">
                            <Calendar size={20} />
                          </div>
                          <div className="date-card-info">
                            <span className="date-text">{displayDate}</span>
                            {blockedDate.reason && (
                              <span className="reason-badge">
                                {blockedDate.reason}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeBlockedDate(blockedDate.id)}
                            className="date-remove-btn"
                            title="Eliminar bloqueo"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              {blockedDates.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <CalendarDays size={40} />
                  </div>
                  <p>{t.admin.schedule.noBlockedDates}</p>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer Actions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="action-bar"
      >
        <div className="status-area">
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`status-message ${status.type}`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{status.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-save">
          {saving ? (
            <>
              <Loader2 className="spinner" size={18} />{" "}
              {t.admin.schedule.saving}
            </>
          ) : (
            <>
              <Save size={18} /> {t.admin.schedule.save}
            </>
          )}
        </button>
      </motion.div>

      <style jsx>{`
        .schedule-admin {
          max-width: 1000px;
          margin: 0 auto;
          color: white;
          padding-bottom: 6rem;
        }

        /* Header */
        .page-header {
          margin-bottom: 3rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(56, 189, 248, 0.1);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(56, 189, 248, 0.2);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, #fff, var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-size: 1rem;
        }

        /* Grid Layout */
        .grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 900px) {
          .grid-container {
            grid-template-columns: 1fr 1.5fr;
          }
          .full-span {
            grid-column: 1 / -1;
          }
        }

        /* Glass Cards */
        :global(.glass-card) {
          background: rgba(17, 25, 40, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .card-icon {
          color: var(--color-primary);
        }
        .card-icon.purple {
          color: #a855f7;
        }
        .card-icon.red {
          color: #ef4444;
        }

        h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        /* Inputs */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.8rem;
          font-weight: 500;
        }

        .custom-input,
        .custom-select {
          position: relative;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .custom-input:focus-within,
        .custom-select:focus-within {
          border-color: var(--color-primary);
          background: rgba(56, 189, 248, 0.05);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }

        input,
        select {
          width: 100%;
          background: transparent;
          border: none;
          color: white;
          padding: 1rem;
          font-size: 1rem;
          outline: none;
          font-family: inherit;
        }

        .select-arrow {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        select {
          appearance: none;
          cursor: pointer;
        }

        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.6;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.6;
        }

        /* Days Grid */
        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.8rem;
        }

        :global(.day-card) {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          color: white; /* Ensure text color inheritance */
        }

        :global(.day-card:hover) {
          background: rgba(255, 255, 255, 0.08);
        }

        :global(.day-card.active) {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--color-primary);
        }

        :global(.day-indicator) {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 0.2rem;
          transition: background 0.3s;
        }

        :global(.day-card.active .day-indicator) {
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
        }

        :global(.day-label) {
          font-size: 1.1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
        }

        :global(.day-full) {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.4);
        }

        :global(.day-card.active .day-label) {
          color: var(--color-primary);
        }

        /* Blocked Dates */
        .add-date-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .date-input-wrapper {
          flex: 1;
        }

        .btn-add {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.25);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
        }

        .btn-add:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dates-grid-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          margin-top: 1.5rem;
        }

        .date-card-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.1rem 1.4rem;
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: space-between !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          min-width: 0;
          backdrop-filter: blur(10px);
        }

        .date-card-premium:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(239, 68, 68, 0.25);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .date-card-main {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex: 1;
          min-width: 0;
        }

        .date-card-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(239, 68, 68, 0.1);
          box-shadow: 0 8px 15px -5px rgba(239, 68, 68, 0.2);
        }

        .date-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          min-width: 0;
          overflow: hidden;
        }

        .date-text {
          font-weight: 700;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.95);
          text-transform: capitalize;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .reason-badge {
          font-size: 0.75rem;
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.1);
          padding: 3px 10px;
          border-radius: 8px;
          width: fit-content;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .date-remove-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.3);
          width: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .date-remove-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          transform: scale(1.1);
        }

        .empty-state {
          width: 100%;
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 24px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .empty-icon {
          opacity: 0.2;
          color: #ef4444;
        }

        /* Action Bar */
        .action-bar {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%) !important;
          width: 90%;
          max-width: 900px;
          background: rgba(20, 30, 50, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          z-index: 100;
        }

        .status-message {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 10px;
        }

        .status-message.success {
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
        }

        .status-message.error {
          background: rgba(248, 113, 113, 0.1);
          color: #f87171;
        }

        .btn-save {
          background: var(--color-primary);
          color: var(--color-background);
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-top: 1rem;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px var(--color-primary-glow);
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px var(--color-primary-glow);
          filter: brightness(1.1);
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        /* Missing Styles for Breaks Section */
        .dates-list {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0.8rem;
          margin-top: 1.5rem;
        }

        .date-tag {
          background: rgba(234, 179, 8, 0.08);
          border: 1px solid rgba(234, 179, 8, 0.2);
          padding: 0.8rem 1.2rem;
          border-radius: 14px;
          display: flex;
          width: 100%;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.95rem;
          color: #fcd34d;
          transition: all 0.3s ease;
        }

        .date-tag:hover {
          background: rgba(234, 179, 8, 0.15);
          transform: translateY(-2px);
        }

        .tag-remove {
          background: none;
          border: none;
          padding: 4px;
          color: rgba(234, 179, 8, 0.5);
          cursor: pointer;
          border-radius: 50%;
          display: inline-flex;
          align-items: end;
          transition: all 0.2s;
          margin-left: 0.2rem;
        }

        .tag-remove:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .action-bar {
            width: 95%;
            bottom: 1rem;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          .status-area {
            width: 100%;
            text-align: center;
          }
          .btn-save {
            width: 100%;
            justify-content: center;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
