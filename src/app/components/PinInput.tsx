import { useState, useRef } from "react";
export default function PinInput({ length = 6, onChange }: { length?: number; onChange: (val: string) => void }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, idx: number) => {
    const newValues = [...values];
    newValues[idx] = val.slice(-1);
    setValues(newValues);
    onChange(newValues.join(""));
    if (val && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };  return (
    <div className="flex gap-2 justify-center">
      {values.map((v, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-black/40 border border-gray-700 focus:border-[#36C6E0] outline-none"
        />
      ))}
    </div>
  );
}
