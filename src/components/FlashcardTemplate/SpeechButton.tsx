import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "shadcn/components/ui/button";

export default function SpeechButton({ text }: { text: string }) {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const newUtterance = new SpeechSynthesisUtterance(text);

    var voices = window.speechSynthesis.getVoices().filter((v) => v.lang == "en-US");
    newUtterance.voice = voices[36]; // decent (crap still) ones for linux: 2, 22, 36
    newUtterance.pitch = 0.1;
    newUtterance.lang = "en-US";

    setUtterance(newUtterance);
  }, [text]);

  const handleSpeech = () => {
    if (utterance) {
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Button variant="secondary" className="h-fit p-1" onClick={handleSpeech}>
      <Volume2 size={20} />
    </Button>
  );
}
