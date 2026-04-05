import { useState, useRef, useEffect } from "react";
import "./Otp.css";

const Otp = ({ length = 4, onOtpSubmit }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRef = useRef([]);

    useEffect(() => {
        if (inputRef.current[0]) {
            inputRef.current[0].focus();
        }
    }, [])


    const handleChange = (index, event) => {
        const value = event.target.value;
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");

        if (combinedOtp.length === length) {
            console.log(combinedOtp)
        };
        if (value && index < length - 1 && inputRef.current[index + 1]) {
            inputRef.current[index + 1].focus();
        }
    };
    const handleClick = (index) => {
        inputRef.current[index].setSelectionRange(1, 1);
        if (index > 0 && !otp[otp.indexOf("")]) {
            inputRef.current[otp.indexOf("")].focus();
        }
    }

    const handleKeypress = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0 && inputRef.current[index - 1]) {
            inputRef.current[index - 1].focus();
        }
    }

    return (
        <div className="otp-form">
            <h1 className="otp-heading">Enter Your OTP:</h1>
            {otp.map((value, index) => {
                return (
                    <input
                        type="text"
                        key={index}
                        value={value}
                        onChange={(event) => handleChange(index, event)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(event) => handleKeypress(index, event)}
                        ref={(input) => inputRef.current[index] = input}
                        className="otp-fields"
                    />

                )
            })}

        </div>
    )
}
export default Otp;
