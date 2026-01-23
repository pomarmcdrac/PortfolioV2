"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmBooking } from "@/lib/api";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

function ConfirmContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const confirm = async () => {
      try {
        const success = await confirmBooking(token);
        setStatus(success ? "success" : "error");
      } catch (error) {
        setStatus("error");
      }
    };

    confirm();
  }, [token]);

  return (
    <div className="confirm-page">
      <FloatingBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="confirm-card glass-card"
      >
        {status === "loading" && (
          <div className="status-container">
            <div className="status-icon-wrap loading">
              <Loader2 size={72} className="spinner" />
            </div>
            <h1>{t.booking.confirm.loading}</h1>
            <p className="description">{t.booking.confirm.loadingDesc}</p>
          </div>
        )}

        {status === "success" && (
          <div className="status-container">
            <div className="status-icon-wrap success">
              <CheckCircle size={72} />
              <motion.div
                className="status-glow success-glow"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }}
              />
            </div>
            <h1>{t.booking.confirm.success}</h1>
            <p className="description">{t.booking.confirm.successDesc}</p>
            <div className="button-wrap">
              <button onClick={() => router.push("/")} className="btn-primary">
                <ArrowLeft size={20} /> {t.booking.confirm.back}
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="status-container">
            <div className="status-icon-wrap error">
              <XCircle size={72} />
              <div className="status-glow error-glow" />
            </div>
            <h1>{t.booking.confirm.error}</h1>
            <p className="description">{t.booking.confirm.errorDesc}</p>
            <div className="button-wrap">
              <button
                onClick={() => router.push("/")}
                className="btn-secondary"
              >
                {t.booking.confirm.back}
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .confirm-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: var(--color-background);
          position: relative;
          overflow: hidden;
        }

        .confirm-card {
          max-width: 550px;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .glass-card {
          background: rgba(11, 25, 46, 0.5);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 5rem 3.5rem;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
        }

        .status-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .status-container h1 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          background: linear-gradient(to right, #fff, var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        .status-container .description {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.2rem;
          margin: 0 auto 4rem;
          line-height: 1.8;
          font-weight: 400;
          max-width: 450px;
          text-align: center;
        }

        .status-icon-wrap {
          margin: 0 auto 3rem;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .status-icon-wrap.loading {
          color: var(--color-primary);
        }
        .status-icon-wrap.success {
          color: #4ade80;
        }
        .status-icon-wrap.error {
          color: #ff4444;
        }

        .spinner {
          animation: spin 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .status-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          filter: blur(35px);
          border-radius: 50%;
          z-index: -1;
          opacity: 0.4;
        }

        .success-glow {
          background: #4ade80;
        }
        .error-glow {
          background: #ff4444;
        }

        .button-wrap {
          max-width: 320px;
          margin: 0 auto;
        }

        .btn-primary {
          width: 100%;
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

        .btn-primary:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px var(--color-primary-glow);
        }

        .btn-secondary {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 1.4rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
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
      <style jsx>{`
        .bg-container {
          position: absolute;
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
          filter: blur(100px);
          opacity: 0.15;
          border-radius: 50%;
          animation: move 30s infinite alternate ease-in-out;
        }

        .blob-1 {
          width: 800px;
          height: 800px;
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

        @keyframes move {
          from {
            transform: translate(0, 0) rotate(0deg);
          }
          to {
            transform: translate(100px, 100px) rotate(45deg) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
