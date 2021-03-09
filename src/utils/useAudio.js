import { useEffect, useState } from 'react';

const useAudio = () => {
  const [audio] = useState(
    /** alarm sound required */
    // new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
    new Audio()
  );
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const toggle = () => setPlaying(!playing);

  return [playing, toggle];
};

export default useAudio;
