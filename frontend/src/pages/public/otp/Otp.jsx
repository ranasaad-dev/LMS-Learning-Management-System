import { useState, useRef, useEffect } from "react";
import "./Otp.css";
import authService from "../../../services/authService.js";
import { useParams, useNavigate } from "react-router-dom";
import notify from "../../../components/ui/notify/Notify";

const Otp = ({ length = 6, onOtpSubmit }) => {
    const { tkn } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRef = useRef([]);

    useEffect(() => {
        if (inputRef.current[0]) {
            inputRef.current[0].focus();
        }
    }, [])

    const submitOTP = async (data) => {
        try{
              if (!data.otp) {
                notify("OTP required","warning");
              }
            const response = await authService.verifyOTP(data);
            if(!response){
                
            }
            notify(response.message, "success");
            navigate("/login");
            return response;
        }catch (error) {
            console.error("Error submitting OTP:", error.response?.data || error.message);
        }
    }

    const handleChange = (index, event) => {
        const value = event.target.value;
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");

        if (combinedOtp.length === length) {
            console.log(combinedOtp)
            submitOTP({otp:combinedOtp, token:tkn});
           
            
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
                        onPaste={handlePaste}
                        inputMode="numeric"
                    />

                )
            })}

        </div>
    )
}
export default Otp;
