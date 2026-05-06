"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Sparkles, Trophy, Heart, Moon, Ghost, Pizza } from "lucide-react";
import confetti from "canvas-confetti";


const BouncingLogo = ({ clickCount, stage }: { clickCount: number, stage: number }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // NEW: This acts as a memory-wiper for the drag distance
  const [dragResetKey, setDragResetKey] = useState(0);

  // NEW: When the page (stage) changes, unfreeze and reset the photo automatically!
  useEffect(() => {
    setIsPaused(false);
    setDragResetKey(prev => prev + 1);
  }, [stage]);

  const basePhoto = "/photo0.jpg";
  const partyPhotos = [
    "/photo1.jpg", "/photo2.jpg", "/photo3.jpg", "/photo4.jpg", "/photo5.jpg",
    "/photo6.jpg", "/photo7.jpg", "/photo8.jpg", "/photo9.jpg", "/photo10.jpg",
    "/photo11.jpg"
  ];

  const currentPhoto = stage < 2 ? basePhoto : partyPhotos[clickCount % 11];
  const patternIndex = stage < 2 ? 0 : clickCount % 10;

  return (
    <>
      {/* 1. The Bouncing Image */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        <style jsx>{`
          @keyframes moveX {
            0% { transform: translateX(15px); }
            100% { transform: translateX(calc(100vw - 190px)); } 
          }
          @keyframes moveY {
            0% { transform: translateY(15px); }
            100% { transform: translateY(calc(100vh - 190px)); } 
          }
          
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes wobble { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } } 
          @keyframes pulsePop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
          @keyframes squish { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.1, 0.9); } }

          .pattern-0-x { animation: moveX 4.5s linear infinite alternate; }
          .pattern-0-y { animation: moveY 3.2s linear infinite alternate; }
          .pattern-0-img { }

          .pattern-1-x { animation: moveX 3.5s linear infinite alternate; }
          .pattern-1-y { animation: moveY 2.5s linear infinite alternate; }
          .pattern-1-img { animation: spin 4s linear infinite; }

          .pattern-2-x { animation: moveX 4s ease-in-out infinite alternate; }
          .pattern-2-y { animation: moveY 2.5s ease-in-out infinite alternate; }
          .pattern-2-img { animation: pulsePop 1.5s ease-in-out infinite; }

          .pattern-3-x { animation: moveX 2.5s steps(8) infinite alternate; }
          .pattern-3-y { animation: moveY 2s steps(5) infinite alternate; }
          .pattern-3-img { animation: wobble 0.2s infinite; }

          .pattern-4-x { animation: moveX 2.8s ease-in-out infinite alternate; }
          .pattern-4-y { animation: moveY 2.2s ease-in-out infinite alternate; }
          .pattern-4-img { animation: spin 5s linear infinite; } 

          .pattern-5-x { animation: moveX 6s ease-in infinite alternate; }
          .pattern-5-y { animation: moveY 4.5s ease-out infinite alternate; }
          .pattern-5-img { animation: wobble 3s ease-in-out infinite; }

          .pattern-6-x { animation: moveX 2s ease-out infinite alternate; }
          .pattern-6-y { animation: moveY 3s ease-in infinite alternate; }
          .pattern-6-img { animation: squish 0.8s infinite alternate; }

          .pattern-7-x { animation: moveX 4s steps(3) infinite alternate; }
          .pattern-7-y { animation: moveY 3.2s steps(4) infinite alternate; }
          .pattern-7-img { animation: squish 0.4s steps(2) infinite; }

          .pattern-8-x { animation: moveX 3s linear infinite alternate; }
          .pattern-8-y { animation: moveY 1.2s cubic-bezier(0.5, 0.05, 1, 0.5) infinite alternate; }
          .pattern-8-img { animation: pulsePop 0.6s infinite alternate; }

          .pattern-9-x { animation: moveX 10s linear infinite alternate; }
          .pattern-9-y { animation: moveY 8s linear infinite alternate; }
          .pattern-9-img { animation: spin 12s linear infinite reverse; }
        `}</style>

        <div
          className={`absolute pattern-${patternIndex}-x`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          <div
            className={`w-[160px] h-[160px] drop-shadow-2xl pattern-${patternIndex}-y`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {/* THIS IS THE DRAGGABLE WRAPPER */}
            <motion.div
              key={dragResetKey} // 👈 THIS WIPES THE DRAG MEMORY SO IT DOESN'T FLY OFF SCREEN
              drag
              dragMomentum={false}
              onDragStart={() => setIsPaused(true)}
              // We leave off onDragEnd so it stays frozen where she drops it!
              className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                key={currentPhoto}
                src={currentPhoto}
                alt="Her Face"
                onClick={() => {
                  setIsExpanded(true);
                  setIsPaused(true);
                }}
                className={`w-full h-full object-cover rounded-full border-[5px] border-white shadow-xl pattern-${patternIndex}-img`}
                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. THE EXPANDED LIGHTBOX POPUP */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsExpanded(false);
              setIsPaused(false);
              setDragResetKey(prev => prev + 1); // 👈 WIPES MEMORY WHEN POPUP CLOSES
            }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md cursor-zoom-out p-6 pointer-events-auto"
          >
            <motion.img
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              src={currentPhoto}
              className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-[2rem] border-[8px] border-white shadow-2xl"
            />
            <p className="mt-8 text-white/60 font-medium tracking-widest uppercase text-sm animate-pulse">
              Tap anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- THE PHOTO EXPLOSION ANIMATION ---
const PhotoExplosion = () => {
  const partyPhotos = [
    "/photo1.jpg", "/photo2.jpg", "/photo3.jpg", "/photo4.jpg", "/photo5.jpg",
    "/photo6.jpg", "/photo7.jpg", "/photo8.jpg", "/photo9.jpg", "/photo10.jpg",
    "/photo11.jpg"
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden" aria-hidden="true">
      {partyPhotos.map((src, i) => {
        const angle = (i / 11) * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 100;

        return (
          <motion.img
            key={i}
            src={src}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white shadow-2xl"
            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              x: [0, tx, tx * 1.5],
              y: [0, ty, 1000],
              rotate: [0, Math.random() * 360, Math.random() * 720],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random(),
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};

// --- HIGH-DENSITY SWAYING EMOJIS BACKGROUND (UNTOUCHED!) ---
const FloatingEmojis = () => {
  const emojiSourceList = ["🌸", "✨", "🦋", "💖", "☕", "🐱", "🐈", "🍦", "💫", "😻", "🌈", "🐾"];
  const emojiCount = 45;

  const generatedEmojiData = useMemo(() => {
    return Array.from({ length: emojiCount }).map((_, i) => {
      const baseLeft = Math.random() * 100;
      return {
        emoji: emojiSourceList[Math.floor(Math.random() * emojiSourceList.length)],
        size: ["text-lg", "text-xl", "text-2xl", "text-3xl"][Math.floor(Math.random() * 4)],
        initialLeft: `${baseLeft}vw`,
        animationDuration: `${12 + Math.random() * 15}s`,
        animationDelay: `-${Math.random() * 20}s`,
        swayDuration: `${3 + Math.random() * 4}s`,
        swayDelay: `-${Math.random() * 5}s`,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-15vh) rotate(360deg); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(-20px); }
          50% { transform: translateX(20px); }
        }
        .emoji-container {
          position: absolute;
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0;
        }
        .emoji-sway {
          animation-name: sway;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
      {generatedEmojiData.map((item, index) => (
        <div
          key={index}
          className={`emoji-container ${item.size}`}
          style={{
            left: item.initialLeft,
            animationDuration: item.animationDuration,
            animationDelay: item.animationDelay,
          }}
        >
          <div
            className="emoji-sway"
            style={{
              animationDuration: item.swayDuration,
              animationDelay: item.swayDelay,
            }}
          >
            {item.emoji}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ExamOverParty() {
  const [stage, setStage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setMounted(true);
    fireConfetti();

    // --- NEW PRELOADER CODE ---
    // This secretly downloads all photos in the background as soon as she opens the link!
    const photosToPreload = [
      "/photo0.jpg", "/photo1.jpg", "/photo2.jpg", "/photo3.jpg", "/photo4.jpg",
      "/photo5.jpg", "/photo6.jpg", "/photo7.jpg", "/photo8.jpg", "/photo9.jpg",
      "/photo10.jpg", "/photo11.jpg"
    ];

    photosToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
    // --------------------------

  }, []);

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ffb7b2', '#ff9a9e', '#fecfef', '#a1c4fd', '#c2e9fb']
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ffb7b2', '#ff9a9e', '#fecfef', '#a1c4fd', '#c2e9fb']
      }));
    }, 250);
  };

  const dopamineBlast = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      zIndex: 100,
      colors: ['#f43f5e', '#ec4899', '#d946ef', '#fbbf24']
    });
  };
  // This intercepts the click, pings your backend, and opens WhatsApp
  // This intercepts the click, pings your backend, and opens WhatsApp
  const handleOptionClick = async (optionName: string, whatsappUrl: string) => {
    try {
      console.log(`Sending ${optionName} to backend...`); // Adds a log to your browser console

      // 1. Ping your backend silently
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clickedBy: "Samridhi",
          action: "WhatsApp Choice", // 👈 THIS WAS MISSING!
          optionSelected: optionName,
          timestamp: new Date().toISOString()
        })
      });

    } catch (error) {
      console.error("Backend tracking failed, but we still open WhatsApp!", error);
    } finally {
      // 2. Open WhatsApp after the backend ping finishes
      window.open(whatsappUrl, '_blank');
    }
  };
  // This silently pings your backend when she selects her mood on Page 2
  const trackMoodSelection = async (moodText: string) => {
    try {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clickedBy: "Samridhi",
          action: "Mood Selected",
          optionSelected: moodText,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error("Backend tracking failed for mood selection", error);
    }
  };


  const handleDopamineClick = () => {
    setClickCount((prev) => prev + 1);
    dopamineBlast();
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff9a9e] flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative">

      <FloatingEmojis />
      <BouncingLogo clickCount={clickCount} stage={stage} />
      {showExplosion && <PhotoExplosion />}

      <motion.div
        className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 sm:p-12 relative z-10 border-4 border-white/50"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
      >
        <AnimatePresence mode="wait">

          {stage === 0 && (
            <motion.div key="stage0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center space-y-8">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="inline-block bg-gradient-to-tr from-pink-300 to-orange-300 p-6 rounded-full shadow-lg mb-4"
              >
                <PartyPopper className="w-16 h-16 text-white" />
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 leading-tight pb-2">
                  YEAAAAAHHHHHH! <br /> EXAMS KHATAM!
                </h1>
                <p className="text-lg text-slate-600 font-medium px-4">
                  Aatma ko aakhir shanti mil hi gayi. Syllabus bhaad mein jaaye, ab khul ke saans la log log! 😮‍💨
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setStage(1); fireConfetti(); }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                Aage Dekha Jaao ✨
              </motion.button>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div key="stage1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
              <div className="text-center space-y-2">
                <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest inline-block mb-2">Dimaag Ka Haal</span>
                <h2 className="text-3xl font-bold text-pink-500">So, What's Your Mood Now?</h2>

              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <Moon className="w-5 h-5" />, text: "Deh toot gail ba, agle 72 ghante tak Kumbhkaran mode activated 😴", color: "hover:bg-indigo-50 hover:border-indigo-300" },
                  { icon: <Ghost className="w-5 h-5" />, text: "bache hue din bas scrolling and movies aur bahar khi ghumne ka plan hai 👻", color: "hover:bg-zinc-50 hover:border-zinc-300" },
                  { icon: <Pizza className="w-5 h-5" />, text: "Dhoop aur syllabus ne dimaag fry kar diya, ab bas motihaari wapas jana hai 🍕🧊", color: "hover:bg-orange-50 hover:border-orange-300" }
                ].map((item, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      trackMoodSelection(item.text);
                      setStage(2);
                      setShowExplosion(true);
                      dopamineBlast();
                      setTimeout(() => setShowExplosion(false), 4000);
                    }}
                    className={`flex items-center gap-4 w-full text-left bg-white border-2 border-slate-100 p-4 rounded-2xl text-slate-700 font-semibold transition-all shadow-sm ${item.color}`}
                  >
                    <div className="bg-slate-50 p-2 rounded-xl text-slate-500 shrink-0">
                      {item.icon}
                    </div>
                    {item.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div key="stage2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-4">
              <div className="space-y-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block bg-yellow-100 p-6 rounded-full mb-2 shadow-inner"
                >
                  <Trophy className="w-14 h-14 text-yellow-500" />
                </motion.div>

                <h2 className="text-3xl font-bold text-slate-800">Officially the Cutest Survivor 🎀✨</h2>

                <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 space-y-3 text-left">
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Ekdum bhaukal tight karke nikal di ye semester! Woh saara stress, late nights, aur exam wali anxiety... sab khatam.
                  </p>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Bohot badhiya kiya tumne. Ab chup-chaap saare alarms delete karo aur mast aaram karo! 💖
                  </p>
                </div>
              </div>

              {/* Wrapper for buttons with conditional rendering */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDopamineClick}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 relative overflow-hidden"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  {/* REQUIREMENT: Text changes based on clickCount */}
                  {clickCount === 0 ? "click here 😉" : "click again 😉"}
                </motion.button>

                {/* REQUIREMENT: High-Five button only appears after 5 clicks */}
                {/* REQUIREMENT: High-Five button changes into a fun menu! */}
                <AnimatePresence mode="wait">
                  {/* Shows the initial "Send Aditya something..." button after 5 clicks */}
                  {clickCount >= 5 && !showOptions && (
                    <motion.button
                      key="reveal-button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() => setShowOptions(true)}
                      className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2"
                    >
                      <span className="text-xl">💌</span>
                      Send Aditya something...
                    </motion.button>
                  )}

                  {/* The Menu that pops up when she clicks the button above */}
                  {showOptions && (
                    <motion.div
                      key="options-menu"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 w-full pt-2"
                    >
                      <motion.button
                        onClick={() => handleOptionClick(
                          "High-Five",
                          "https://wa.me/917857825881?text=heyy,%20I%20liked%20your%20website%20%F0%9F%99%8C%F0%9F%8F%BB"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-md flex justify-between items-center"
                      >
                        Send High-Five 🙌
                        <span className="text-sm bg-black/10 px-2 py-1 rounded-lg">Send ↗</span>
                      </motion.button>

                      <motion.button
                        onClick={() => handleOptionClick(
                          "Complain about photos",
                          "https://wa.me/917857825881?text=Heyy!%20Website%20is%20cute%20but%20some%20of%20those%20photos%20are%20so%20embarrassing!%20%F0%9F%98%82%F0%9F%98%AD"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-md flex justify-between items-center"
                      >
                        Complain about the photos 😂
                        <span className="text-sm bg-black/10 px-2 py-1 rounded-lg">Send ↗</span>
                      </motion.button>

                      <motion.button
                        onClick={() => handleOptionClick(
                          "Custom Message",
                          "https://wa.me/917857825881"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-md flex justify-between items-center"
                      >
                        Write your own message ✍️
                        <span className="text-sm bg-black/10 px-2 py-1 rounded-lg">Send ↗</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </main>
  );
}