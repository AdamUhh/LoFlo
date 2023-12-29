import { Pause, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "shadcn/components/ui/button";

export default function SpeechButton({ text }: { text: string }) {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    const newUtterance = new SpeechSynthesisUtterance(text);

    var voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    if (voices.length <= 10) newUtterance.voice = voices[1]; // ? decent uk chrome
    else newUtterance.voice = voices[36]; // decent (crap still) ones for linux: 2, 22, 36
    newUtterance.pitch = 0.1;
    newUtterance.lang = "en-US";

    setUtterance(newUtterance);

    return () => {
      // Cleanup: Cancel speech and clear utterance when the component is unmounted
      setIsPlaying(false);
      setUtterance(null);
    };
  }, [text]);

  useEffect(() => {
    const handleEnd = () => {
      setIsPlaying(false);
    };

    if (utterance) {
      utterance.onend = handleEnd;
    }

    return () => {
      // Cleanup: Remove the event handler when the component is unmounted
      if (utterance) {
        speechSynthesis.cancel();
        utterance.onend = null;
      }
    };
  }, [utterance]);

  const handleSpeech = () => {
    if (utterance) {
      if (speechSynthesis.speaking) {
        setIsPlaying(false);
        speechSynthesis.cancel();
      } else {
        setIsPlaying(true);
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <Button variant="secondary" className="h-fit p-1" onClick={handleSpeech}>
      {isPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
    </Button>
  );
}
