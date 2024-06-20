import React, { useState } from "react";
import "./App.css";
import OpenAI from "openai";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "Hindi", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [correctedText, setCorrectedText] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("");

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const detectLanguage = async (text) => {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Detect the language of this text: ${text}`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response.choices[0].message.content.trim();
  };

  const correctSpelling = async (text) => {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Correct the spelling mistakes in this text: ${text}`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response.choices[0].message.content.trim();
  };

  const translate = async (text, language) => {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Translate this into ${language}: ${text}`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response.choices[0].message.content.trim();
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    try {
      const detectedLang = await detectLanguage(formData.message);
      setDetectedLanguage(detectedLang);
      const corrected = await correctSpelling(formData.message);
      setCorrectedText(corrected);
      const translated = await translate(corrected, formData.language);
      setTranslation(translated);
    } catch (err) {
      console.error("Error during translation:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Translation</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="hindi"
            name="language"
            value="Hindi"
            defaultChecked={formData.language === "Hindi"}
            onChange={handleInputChange}
          />
          <label htmlFor="hindi">Hindi</label>

          <input
            type="radio"
            id="spanish"
            name="language"
            value="Spanish"
            onChange={handleInputChange}
          />
          <label htmlFor="spanish">Spanish</label>

          <input
            type="radio"
            id="english"
            name="language"
            value="English"
            onChange={handleInputChange}
          />
          <label htmlFor="english">English</label>

          <input
            type="radio"
            id="japanese"
            name="language"
            value="Japanese"
            onChange={handleInputChange}
          />
          <label htmlFor="japanese">Japanese</label>

          <input
            type="radio"
            id="french"
            name="language"
            value="French"
            onChange={handleInputChange}
          />
          <label htmlFor="french">French</label>
        </div>

        <textarea
          name="message"
          placeholder="Type your message here.."
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>

      <div className="translation">
        {detectedLanguage && (
          <div className="detected-language">
            <strong>Detected Language:</strong> {detectedLanguage}
          </div>
        )}
        <div className="temp">
          <h3>Corrected Text</h3>
          <div className="corrected-text flex-row">
            {isLoading ? <BeatLoader size={12} color={"red"} /> : correctedText}
          </div>
        </div>
        <div className="temp">
          <h3>Translated Text</h3>
          <div className="translated-text flex-row">
            <div>
              {isLoading ? <BeatLoader size={12} color={"red"} /> : translation}
            </div>

            <div className="copy-btn" onClick={handleCopy}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
};

export default App;
