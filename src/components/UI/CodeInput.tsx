import { useRef, useState } from "react";
import "@/components/UI/CodeInput.css"

type Props = {
  onComplete: (code: string) => void;
};

export default function CodeInput({ onComplete }: Props) {
  const [values, setValues] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // автофокус вперёд
    if (value && index < 5) {
      focusInput(index + 1);
    }

    // если все заполнены
    const code = newValues.join("");
    if (code.length === 6 && !newValues.includes("")) {
      onComplete(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // backspace назад
    if (e.key === "Backspace" && !values[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const newValues = paste.split("");
    setValues(newValues);

    newValues.forEach((v, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = v;
      }
    });

    onComplete(paste);
  };

  return (
    <div className = "handle-p" onPaste={handlePaste}>
      {values.map((val, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={val}
         ref={(el) => {
  inputsRef.current[index] = el;
}}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="handle-ch"
          
        />
      ))}
    </div>
  );
}