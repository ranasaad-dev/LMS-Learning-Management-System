import { useState, useRef, useEffect } from "react";
import "./Otp.css";

const Otp = ({ length = 4, onOtpSubmit, isSubmitting = false }) => {
  const [otp, setOtp] = useState(() => new Array(length).fill(""));
  const inputRef = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  // Handle input change
  const handleChange = (index, e) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    // Submit when complete
    const combined = newOtp.join("");
    if (combined.length === length && !newOtp.includes("")) {
      onOtpSubmit?.(combined);
    }
  };

  // Handle paste (full OTP)
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.slice(0, length).split("");
    const newOtp = [...otp];

    pasteArray.forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);

    if (pasteArray.length === length) {
      onOtpSubmit?.(newOtp.join(""));
    }

    // Focus last filled input
    const lastIndex = pasteArray.length - 1;
    inputRef.current[lastIndex]?.focus();
  };

  // Handle key navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRef.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowRight") {
      inputRef.current[index + 1]?.focus();
    }

    if (e.key === "ArrowLeft") {
      inputRef.current[index - 1]?.focus();
    }
  };

  // Handle click (jump to first empty)
  const handleClick = (index) => {
    const firstEmptyIndex = otp.indexOf("");

    if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
      inputRef.current[firstEmptyIndex]?.focus();
    }
  };

  return (
    <div className="otp-form">
      <h1 className="otp-heading">Enter Your OTP</h1>

      <div role="group" aria-label="One-time password input">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength={1}
            ref={(el) => (inputRef.current[index] = el)}
            className="otp-fields"

            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onClick={() => handleClick(index)}
            onFocus={(e) => e.target.select()}
            onPaste={handlePaste}

            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"

            aria-label={`OTP digit ${index + 1}`}
            disabled={isSubmitting}
          />
        ))}
      </div>
    </div>
  );
};

export default Otp;