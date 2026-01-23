"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  Phone,
} from "lucide-react";
import { getAvailableSlots, createBooking } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function BookingPage() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [formErrors, setFormErrors] = useState({
    email: false,
    phone: false,
    name: false,
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Allows +, spaces, dashes, parentheses and 8-15 digits
    const cleaned = phone.replace(/[^\d+]/g, "");
    return cleaned.length >= 8 && cleaned.length <= 15;
  };

  const isFormValid =
    form.name.trim().length >= 3 &&
    validateEmail(form.email) &&
    validatePhone(form.phone);

  const topics = [
    {
      id: "project",
      name: t.booking.topics.project,
      duration: "30 min",
      icon: "🚀",
      description: t.booking.topics.projectDesc,
      glow: "rgba(56, 189, 248, 0.4)",
    },
    {
      id: "mentorship",
      name: t.booking.topics.mentorship,
      duration: "45 min",
      icon: "💻",
      description: t.booking.topics.mentorshipDesc,
      glow: "rgba(168, 85, 247, 0.4)",
    },
    {
      id: "hire",
      name: t.booking.topics.hire,
      duration: "60 min",
      icon: "🤝",
      description: t.booking.topics.hireDesc,
      glow: "rgba(34, 197, 94, 0.4)",
    },
    {
      id: "coffee",
      name: t.booking.topics.coffee,
      duration: "15 min",
      icon: "☕",
      description: t.booking.topics.coffeeDesc,
      glow: "rgba(234, 179, 8, 0.4)",
    },
  ];

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  async function fetchSlots() {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  const handleTopicSelect = (topic: any) => {
    setSelectedTopic(topic);
  };

  const handleBooking = async () => {
    if (!form.name || !form.email || !form.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse duration: topics like "30 min"
      const durationMinutes = parseInt(selectedTopic.duration) || 30;

      // Construction for ISO8601 (local format accepted by backend)
      const startTime = `${selectedDate}T${selectedTime}:00`;

      // End time calculation
      const start = new Date(`${selectedDate}T${selectedTime}`);
      const end = new Date(start.getTime() + durationMinutes * 60000);

      const endTime =
        end.getFullYear() +
        "-" +
        String(end.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(end.getDate()).padStart(2, "0") +
        "T" +
        String(end.getHours()).padStart(2, "0") +
        ":" +
        String(end.getMinutes()).padStart(2, "0") +
        ":00";

      const nameParts = form.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || ".";

      const payload = {
        firstName,
        lastName,
        email: form.email.trim(),
        startTime,
        endTime,
        description: `Topic: ${selectedTopic.name}. Phone: ${form.phone}. Message: ${form.message}`,
      };

      const result = await createBooking(payload);
      if (result) {
        setBookingResult(result);
        setStep(5);
      } else {
        setStep(6);
      }
    } catch (error) {
      setStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 1.02, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <div className="booking-page">
      <FloatingBackground />

      <div className="content-wrapper">
        <div className="top-nav">
          <Link href="/" className="back-home">
            <ChevronLeft size={18} />
            <span>{t.nav.home}</span>
          </Link>
        </div>

        {step < 5 && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header"
          >
            <div className="icon-badge">
              <CalendarCheck size={28} />
            </div>
            <div className="header-text">
              <h1>{t.booking.title}</h1>
              <p>{t.booking.subtitle}</p>
            </div>
          </motion.header>
        )}

        <div className="main-form-container">
          {/* Progress Indicator */}
          {step < 5 && (
            <div className="progress-nav">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="progress-step-item">
                  <div
                    className={`step-circle ${step === i ? "active" : step > i ? "completed" : ""}`}
                  >
                    {step > i ? <CheckCircle size={18} /> : <span>{i}</span>}
                  </div>
                  {i < 4 && (
                    <div className={`step-line ${step > i ? "active" : ""}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: TOPIC */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="step-content glass-card"
              >
                <div className="step-header">
                  <Info className="step-icon" size={20} />
                  <h2 className="step-title">{t.booking.steps.topic}</h2>
                </div>

                <div className="topic-grid">
                  {topics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicSelect(topic)}
                      className={`topic-card ${selectedTopic?.id === topic.id ? "selected" : ""}`}
                      style={{ "--glow-color": topic.glow } as any}
                    >
                      <div className="topic-icon">{topic.icon}</div>
                      <h3 className="topic-title">{topic.name}</h3>
                      <div className="topic-duration">
                        <Clock size={16} /> {topic.duration}
                      </div>
                      <p className="topic-desc">{topic.description}</p>

                      {selectedTopic?.id === topic.id && (
                        <motion.div
                          layoutId="neon-glow"
                          className="neon-glow"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="action-buttons centered">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedTopic}
                    className="btn-primary main-cta"
                  >
                    {t.booking.form.next} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="step-content glass-card"
              >
                <div className="card-header">
                  <CalendarIcon className="accent-icon" />
                  <h2 style={{ paddingTop: "1rem" }}>{t.booking.steps.date}</h2>
                </div>

                <div className="date-picker-wrap">
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="custom-date-input"
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`input-info ${selectedDate ? "has-value" : ""}`}
                  >
                    {selectedDate ? (
                      <>
                        <CheckCircle size={16} /> Fecha seleccionada
                        correctamente
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Selecciona un día para ver
                        disponibilidad
                      </>
                    )}
                  </motion.div>
                </div>

                <div className="action-buttons">
                  <button onClick={() => setStep(1)} className="btn-secondary">
                    <ChevronLeft size={20} /> {t.booking.form.back}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedDate}
                    className="btn-primary"
                  >
                    {t.booking.form.next} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TIME */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="step-content glass-card"
              >
                <div className="card-header">
                  <Clock className="accent-icon" />
                  <h2 style={{ paddingTop: "1rem" }}>{t.booking.steps.time}</h2>
                  <div className="date-badge">
                    {new Date(selectedDate + "T00:00:00")
                      .toLocaleDateString(
                        language === "ES" ? "es-ES" : "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                      .replace(/ de /g, " ")}
                  </div>
                </div>

                <div className="slots-container">
                  {loadingSlots ? (
                    <div className="slots-loading">
                      <Loader2 className="spinner" size={48} />
                      <p>{t.booking.form.loading}</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="slots-grid">
                      {availableSlots.map((slot) => (
                        <motion.button
                          key={slot}
                          whileHover={{ y: -5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTime(slot)}
                          className={`slot-card ${selectedTime === slot ? "selected" : ""}`}
                        >
                          <span className="slot-time">{slot}</span>

                          {selectedTime === slot && (
                            <motion.div
                              layoutId="neon-glow-slot"
                              className="neon-glow"
                              style={{
                                borderColor: "var(--color-primary)",
                                boxShadow: "0 0 30px var(--color-primary-glow)",
                              }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="no-slots">
                      <p>No hay horarios disponibles para este día.</p>
                      <button onClick={() => setStep(2)} className="btn-text">
                        Elegir otra fecha
                      </button>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  <button onClick={() => setStep(2)} className="btn-secondary">
                    <ChevronLeft size={20} /> {t.booking.form.back}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!selectedTime}
                    className="btn-primary"
                  >
                    {t.booking.form.continue} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: FORM */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="step-content glass-card"
              >
                <div className="card-header">
                  <User className="accent-icon" />
                  <h2 style={{ paddingTop: "1rem" }}>
                    {t.booking.steps.details}
                  </h2>
                </div>

                <div className="booking-summary">
                  <div className="summary-item">
                    <span className="label">Tema:</span>
                    <span className="value">
                      {selectedTopic?.icon} {selectedTopic?.name}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Cita:</span>
                    <span className="value">
                      {selectedDate} @ {selectedTime}
                    </span>
                  </div>
                </div>

                <div className="contact-form">
                  <div className="form-group">
                    <label>{t.booking.form.name}</label>
                    <div
                      className={`input-with-icon ${
                        form.name && form.name.trim().length < 3 ? "error" : ""
                      }`}
                    >
                      <User size={18} />
                      <input
                        type="text"
                        placeholder={t.booking.form.placeholderName}
                        value={form.name}
                        maxLength={60}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t.booking.form.email}</label>
                    <div
                      className={`input-with-icon ${
                        form.email && !validateEmail(form.email) ? "error" : ""
                      }`}
                    >
                      <span className="at-icon">@</span>
                      <input
                        type="email"
                        placeholder={t.booking.form.placeholderEmail}
                        value={form.email}
                        maxLength={100}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t.booking.form.phone}</label>
                    <div
                      className={`input-with-icon ${
                        form.phone && !validatePhone(form.phone) ? "error" : ""
                      }`}
                    >
                      <Phone size={18} />
                      <input
                        type="tel"
                        placeholder={t.booking.form.placeholderPhone}
                        value={form.phone}
                        maxLength={20}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t.booking.form.message}</label>
                    <div className="input-with-icon align-top">
                      <MessageSquare size={18} />
                      <textarea
                        placeholder={t.booking.form.placeholderMessage}
                        value={form.message}
                        maxLength={500}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button onClick={() => setStep(3)} className="btn-secondary">
                    {t.booking.form.back}
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={isSubmitting || !isFormValid}
                    className="btn-primary btn-submit"
                  >
                    {isSubmitting ? (
                      <Loader2 className="spinner" size={20} />
                    ) : (
                      <>
                        <CalendarCheck size={20} />
                        {t.booking.form.submit}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-container glass-card"
              >
                <div className="success-icon-wrap">
                  <CheckCircle size={64} />
                  <motion.div
                    className="success-glow"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                    }}
                  />
                </div>
                <h2>{t.booking.success.title}</h2>
                <p>{t.booking.success.message}</p>

                <div className="action-buttons centered">
                  <Link href="/" className="btn-primary main-cta">
                    {t.booking.success.back}
                  </Link>
                </div>
              </motion.div>
            )}

            {/* STEP 6: ERROR */}
            {step === 6 && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-container glass-card"
              >
                <div className="success-icon-wrap" style={{ color: "#ff4444" }}>
                  <XCircle size={64} />
                  <div
                    className="status-glow"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "#ff4444",
                      filter: "blur(35px)",
                      borderRadius: "50%",
                      zIndex: -1,
                      opacity: 0.3,
                    }}
                  />
                </div>
                <h2>{t.booking.error.title}</h2>
                <p>{t.booking.error.message}</p>

                <div className="action-buttons centered">
                  <button onClick={() => setStep(4)} className="btn-secondary">
                    {t.booking.error.back}
                  </button>
                  <Link href="/" className="btn-primary">
                    {t.booking.error.home}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .booking-page {
          min-height: 100vh;
          padding: 8rem 2rem 4rem;
          color: white;
          position: relative;
          overflow-x: hidden;
          background: var(--color-background);
        }

        .content-wrapper {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
        }

        .top-nav {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 1rem;
        }

        :global(.back-home) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          color: rgba(255, 255, 255, 0.45) !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          transition: all 0.3s !important;
          padding: 0.7rem 1.2rem !important;
          border-radius: 12px !important;
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          font-size: 0.95rem !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }

        :global(.back-home span) {
          display: inline-block !important;
          line-height: normal !important;
          transform: none !important;
        }

        :global(.back-home svg) {
          display: block !important;
          flex-shrink: 0 !important;
        }

        :global(.back-home:hover) {
          color: white !important;
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateX(-5px) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        /* Header (Global override to fix visibility) */
        :global(.header) {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 2rem !important;
          margin-bottom: 3rem !important;
          text-align: left !important;
          max-width: 900px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        :global(.icon-badge) {
          width: 60px !important;
          height: 60px !important;
          background: var(--color-primary-glow) !important;
          border-radius: 18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: var(--color-primary) !important;
          box-shadow: 0 0 30px var(--color-primary-glow) !important;
          border: 1px solid rgba(56, 189, 248, 0.4) !important;
          flex-shrink: 0 !important;
        }

        :global(.header-text) {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.3rem !important;
        }

        :global(.header h1) {
          font-size: clamp(2rem, 5vw, 3.2rem) !important;
          margin-bottom: 0 !important;
          letter-spacing: -1.5px !important;
          line-height: 1.1 !important;
          background: linear-gradient(
            to right,
            #fff,
            var(--color-primary)
          ) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }

        :global(.header p) {
          color: rgba(255, 255, 255, 0.5) !important;
          margin-bottom: 0 !important;
          font-size: 1.1rem !important;
          font-weight: 300 !important;
          line-height: 1.4 !important;
        }

        /* Progress Nav */
        .progress-nav {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 5rem;
          margin-top: 2rem;
        }

        .progress-step-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: rgba(255, 255, 255, 0.2);
        }

        .step-circle.active {
          background: var(--color-primary);
          color: var(--color-background);
          box-shadow: 0 0 25px var(--color-primary-glow);
          border-color: var(--color-primary);
          transform: scale(1.1);
        }

        .step-circle.completed {
          background: rgba(56, 189, 248, 0.1);
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        .step-line {
          width: 50px;
          height: 3px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.5s ease;
        }

        .step-line.active {
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary-glow);
        }

        /* Forms & Cards */
        .glass-card {
          background: rgba(11, 25, 46, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 40px;
          padding: 4rem;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
        }

        .step-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 3.5rem;
        }

        .step-icon {
          color: var(--color-primary);
        }

        .step-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 0;
        }

        /* Step 1: Topics (Global override to fix scoping issue) */
        :global(.topic-grid) {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          :global(.topic-grid) {
            grid-template-columns: 1fr;
          }
        }

        :global(.topic-card) {
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 24px !important;
          padding: 3rem 2rem !important;
          cursor: pointer !important;
          position: relative !important;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          z-index: 1 !important;
          height: 100% !important;
        }

        :global(.topic-card:hover) {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: var(--color-primary) !important;
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
        }

        :global(.topic-card.selected) {
          background: rgba(56, 189, 248, 0.12) !important;
          border-color: var(--color-primary) !important;
          border-width: 2px !important;
          box-shadow: 0 0 30px rgba(56, 189, 248, 0.25) !important;
        }

        :global(.topic-icon) {
          font-size: 3.5rem !important;
          margin-bottom: 2rem !important;
          display: block !important;
          transition: transform 0.3s ease !important;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2)) !important;
        }

        :global(.topic-card.selected .topic-icon) {
          transform: scale(1.1) !important;
          filter: drop-shadow(0 0 20px var(--color-primary-glow)) !important;
        }

        :global(.topic-title) {
          font-size: 1.6rem !important;
          font-weight: 800 !important;
          margin-bottom: 0.8rem !important;
          color: white !important;
          letter-spacing: -0.5px !important;
        }

        :global(.topic-duration) {
          display: flex !important;
          align-items: center !important;
          gap: 0.6rem !important;
          color: var(--color-primary) !important;
          font-size: 1.05rem !important;
          margin-bottom: 1.5rem !important;
          font-weight: 700 !important;
        }

        :global(.topic-desc) {
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 1.05rem !important;
          line-height: 1.7 !important;
          margin: 0 !important;
        }

        :global(.neon-glow) {
          position: absolute !important;
          top: -3px !important;
          left: -3px !important;
          right: -3px !important;
          bottom: -3px !important;
          border-radius: 27px !important;
          border: 2px solid var(--color-primary) !important;
          box-shadow: 0 0 25px var(--color-primary-glow) !important;
          z-index: -1 !important;
          pointer-events: none !important;
        }

        /* Buttons */
        .action-buttons {
          display: flex;
          gap: 1.5rem;
          margin-top: 4rem;
        }

        .action-buttons.centered {
          justify-content: center;
        }

        .btn-primary {
          flex: 2;
          background: var(--color-primary);
          color: var(--color-background);
          border: none;
          padding: 1.4rem;
          border-radius: 20px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 15px 30px -10px var(--color-primary-glow);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px var(--color-primary-glow);
          filter: brightness(1.1);
        }

        .btn-primary:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none;
        }

        .main-cta {
          max-width: 400px;
          width: 100%;
        }

        .btn-secondary {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 1.4rem;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Inputs */
        .date-picker-wrap {
          width: 100%;
          margin: 2rem 0;
        }

        .custom-date-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 24px;
          color: white;
          font-size: 1.5rem;
          outline: none;
          transition: all 0.3s;
          cursor: pointer;
          font-weight: 300;
          margin-bottom: 1rem;
        }

        .custom-date-input:focus {
          border-color: var(--color-primary);
          background: rgba(56, 189, 248, 0.05);
        }

        .input-info {
          margin-top: 2.5rem;
          display: flex;
          align-items: center;
          padding: 1rem 2rem;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s;
        }

        .input-info.has-value {
          color: var(--color-primary);
          font-weight: 600;
        }

        /* Slots */
        .card-header {
          margin-bottom: 3.5rem;
          text-align: center;
        }
        .accent-icon {
          color: var(--color-primary);
          padding: 5rem;
          width: 54px;
          height: 54px;
          opacity: 0.9;
        }
        .card-header h2 {
          font-size: 2.22rem;
          font-weight: 800;
          margin-bottom: 1.5rem; /* Más espacio bajo el título */
        }
        .date-badge {
          display: inline-block;
          padding: 0.6rem 1.2rem;
          background: rgba(56, 189, 248, 0.1);
          color: var(--color-primary);
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          text-transform: capitalize;
        }

        .slots-container {
          margin: 3rem 0;
        }

        /* Updated Slots (Matching Topics Style) */
        :global(.slots-grid) {
          display: grid !important;
          grid-template-columns: repeat(
            auto-fill,
            minmax(100px, 1fr)
          ) !important;
          gap: 1rem !important;
          max-height: 500px !important;
          overflow-y: auto !important;
          padding: 0.5rem !important;
          margin-top: 1rem !important;
        }

        :global(.slot-card) {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 20px !important;
          padding: 1rem !important;
          cursor: pointer !important;
          position: relative !important;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 1.2rem !important;
          color: white !important;
          width: 100% !important;
          border-width: 1px !important;
          outline: none !important;
        }

        :global(.slot-card:hover) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
        }

        :global(.slot-card.selected) {
          background: rgba(56, 189, 248, 0.08) !important;
          border-color: var(--color-primary) !important;
          border-width: 2px !important;
        }

        :global(.slot-icon) {
          color: var(--color-primary) !important;
          transition: all 0.3s ease !important;
          opacity: 0.8 !important;
        }

        :global(.slot-card.selected .slot-icon) {
          transform: scale(1.2) !important;
          opacity: 1 !important;
          filter: drop-shadow(0 0 10px var(--color-primary-glow)) !important;
        }

        :global(.slot-time) {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
          color: white !important;
        }

        :global(.slot-badge) {
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          font-size: 0.85rem !important;
          color: var(--color-primary) !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          margin-top: 0.2rem !important;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .no-slots {
          text-align: center;
          padding: 5rem 1rem;
          color: rgba(255, 255, 255, 0.4);
          background: rgba(0, 0, 0, 0.2);
          border-radius: 24px;
        }

        .btn-text {
          background: none;
          border: none;
          color: var(--color-primary);
          text-decoration: underline;
          margin-top: 1.5rem;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
        }

        /* Summary */
        .booking-summary {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 3.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.2rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .summary-item .label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.1rem;
        }
        .summary-item .value {
          font-weight: 700;
          color: var(--color-primary);
          font-size: 1.1rem;
        }

        /* Form */
        .contact-form {
          display: grid;
          gap: 2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 1.2rem;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 700;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon.align-top {
          align-items: flex-start;
        }

        .input-with-icon :global(svg),
        .input-with-icon .at-icon {
          position: absolute;
          left: 1.5rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .input-with-icon.align-top :global(svg) {
          top: 1.5rem;
        }

        .at-icon {
          font-size: 1.3rem;
          font-weight: bold;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem 1.5rem 1.5rem 4rem;
          border-radius: 20px;
          color: white;
          font-size: 1.1rem;
          transition: all 0.3s;
        }

        .contact-form textarea {
          min-height: 160px;
          resize: none;
          line-height: 1.7;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .input-with-icon.error input {
          border-color: rgba(255, 68, 68, 0.5) !important;
        }

        .input-with-icon.error :global(svg),
        .input-with-icon.error .at-icon {
          color: #ff4444 !important;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
          transform: none !important;
        }

        /* Success */
        .success-container {
          width: 100%;
          text-align: center;
          padding: 6rem 4rem !important;
        }

        .success-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #4ade80;
          margin-bottom: 3.5rem;
          margin-top: 3rem;
          width: 100%;
        }

        .success-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #4ade80;
          filter: blur(35px);
          border-radius: 50%;
          z-index: -1;
        }

        .success-container h2 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 900;
          letter-spacing: -2px;
          background: linear-gradient(to right, #fff, var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .success-container p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.3rem;
          max-width: 550px;
          margin: 0 auto 4rem;
          line-height: 1.8;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}

function FloatingBackground() {
  return (
    <div className="bg-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <style jsx>{`
        .bg-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          background: #051020;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.12;
          border-radius: 50%;
          animation: move 25s infinite alternate ease-in-out;
        }

        .blob-1 {
          width: 700px;
          height: 700px;
          background: var(--color-primary);
          top: -200px;
          right: -200px;
        }

        .blob-2 {
          width: 600px;
          height: 600px;
          background: #a855f7;
          bottom: -150px;
          left: -200px;
          animation-delay: -5s;
        }

        .blob-3 {
          width: 500px;
          height: 500px;
          background: #38bdf8;
          top: 30%;
          left: 40%;
          animation-delay: -10s;
          opacity: 0.08;
        }

        @keyframes move {
          from {
            transform: translate(0, 0) rotate(0deg);
          }
          to {
            transform: translate(150px, 150px) rotate(30deg) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
