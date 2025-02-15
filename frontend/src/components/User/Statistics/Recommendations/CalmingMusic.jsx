import React, { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';

const songs = [
  { name: 'Boba Date', artist: 'Stream Cafe', file: 'bobadate.mp3' },
  { name: 'Coffee Time', artist: 'shushubobo', file: 'coffeetime.mp3' },
  { name: 'Dango', artist: 'Chillpeach', file: 'dango.mp3' },
  { name: 'Lollipop', artist: 'THAIBEATS', file: 'lollipop.mp3' },
  { name: 'Latte', artist: 'Lofi Peach', file: 'latte.mp3' }
];

const CalmingMusic = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    audioRef.current.src = `/music/${songs[nextIndex].file}`;
    audioRef.current.load();
    audioRef.current.addEventListener('canplay', () => {
      audioRef.current.play();
    }, { once: true });
  };

  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
    audioRef.current.src = `/music/${songs[prevIndex].file}`;
    audioRef.current.load();
    audioRef.current.addEventListener('canplay', () => {
      audioRef.current.play();
    }, { once: true });
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleProgressChange = (event) => {
    const newProgress = event.target.value;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: 'url(/images/calmingmusic.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute top-1/2 right-60 transform -translate-y-1/2 bg-white bg-opacity-10 p-6 rounded-lg shadow-lg w-96 border-4 border-white">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#3a3939' }}>Calming Music Playlist</h2>
        <p className="text-lg mb-1 text-center font-bold" style={{ color: '#3a3939' }}>{songs[currentSongIndex].name}</p>
        <p className="text-sm mb-4 text-center" style={{ color: '#3a3939' }}>{songs[currentSongIndex].artist}</p>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={progress}
            onChange={handleProgressChange}
            className="cursor-pointer w-full"
            style={{ accentColor: '#3a3939' }}
          />
        </div>
        <audio ref={audioRef} src={`/music/${songs[currentSongIndex].file}`} />
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div onClick={handlePrevious} className="cursor-pointer">
            <SkipPreviousIcon style={{ fontSize: 40, color: 'white' }} />
          </div>
          <div onClick={handlePlayPause} className="cursor-pointer">
            {isPlaying ? <PauseIcon style={{ fontSize: 40, color: 'white' }} /> : <PlayArrowIcon style={{ fontSize: 40, color: 'white' }} />}
          </div>
          <div onClick={handleNext} className="cursor-pointer">
            <SkipNextIcon style={{ fontSize: 40, color: 'white' }} />
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <VolumeDownIcon style={{ color: 'white' }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="cursor-pointer"
            style={{ accentColor: 'white' }}
          />
          <VolumeUpIcon style={{ color: 'white' }} />
        </div>
      </div>
    </div>
  );
};

export default CalmingMusic;