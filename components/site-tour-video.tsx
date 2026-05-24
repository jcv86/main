import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function SiteTourVideo() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const frames = [
    { image: '/tour-videos/auth-page.png', title: 'Login & Authentication', duration: 3 },
    { image: '/tour-videos/dashboard.png', title: 'Dashboard Overview', duration: 5 },
    { image: '/tour-videos/a3-main.png', title: 'A3 Training Module', duration: 4 },
    { image: '/tour-videos/a3-training-home.png', title: 'Training Home', duration: 5 },
    { image: '/tour-videos/a3-menu.png', title: 'Navigation Menu', duration: 3 },
    { image: '/tour-videos/a3-trainings.png', title: 'Training Routes Overview', duration: 6 },
    { image: '/tour-videos/a3-modules.png', title: 'Progress Modules', duration: 5 },
    { image: '/tour-videos/a3-coaching.png', title: 'Coaching Section', duration: 5 },
    { image: '/tour-videos/coach-practice-room.png', title: 'Coach Practice Room - Introduction', duration: 8 },
    { image: '/tour-videos/coach-questions.png', title: 'Interview Questions - Start', duration: 10 },
    { image: '/tour-videos/coach-more-questions.png', title: 'Interview Practice Details', duration: 12 },
    { image: '/tour-videos/a3-second-question.png', title: 'All Three Interview Questions', duration: 10 },
    { image: '/tour-videos/a3-cv-builder.png', title: 'CV Builder Studio', duration: 8 },
    { image: '/tour-videos/a3-cv-content.png', title: 'CV Builder Content', duration: 10 },
    { image: '/tour-videos/a3-interview-practice.png', title: 'Interview Practice Complete', duration: 6 },
  ];

  const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 3000); // Change frame every 3 seconds

    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const progressPercent = ((currentFrame + 1) / frames.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Display */}
      <div className="relative bg-background/50">
        <img 
          src={frames[currentFrame].image} 
          alt={frames[currentFrame].title}
          className="w-full h-auto"
        />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <h3 className="text-white font-semibold">{frames[currentFrame].title}</h3>
          <p className="text-white/70 text-sm">
            Frame {currentFrame + 1} of {frames.length} • {totalDuration}s total
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-[rgb(80,160,170)] to-[rgb(170,70,170)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="bg-black/80 p-4 space-y-3">
        {/* Frame Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {frames.map((frame, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFrame(idx)}
              className={`flex-shrink-0 h-12 w-12 rounded border-2 transition-all ${
                idx === currentFrame 
                  ? 'border-[rgb(80,160,170)] scale-105' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              title={frame.title}
            >
              <img 
                src={frame.image} 
                alt={`Frame ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-[rgb(80,160,170)] hover:bg-[rgb(80,160,170)]/80 text-white transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <div className="text-white/70 text-sm">
            {frames[currentFrame].duration}s
          </div>
        </div>

        {/* Info */}
        <div className="text-white/60 text-xs space-y-1">
          <p>🎯 <span className="text-white">Tour Contents:</span> Login • Dashboard • A3 Training Module • Coach Practice Room • Interview Questions • CV Builder</p>
          <p>⏱️ <span className="text-white">Total Duration:</span> {totalDuration} seconds • 15 key sections</p>
          <p>📍 <span className="text-white">Focus Areas:</span> Interview coaching section & A3 Training module walkthrough</p>
        </div>
      </div>
    </div>
  );
}
