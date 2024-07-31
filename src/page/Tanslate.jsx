import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const Translate = () => {
  const [formData, setFormData] = useState({
    languageId: "",
    modelId: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [result, setResult] = useState({
    correctedText: "",
    translation: "",
    detectedLanguage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState({ languages: [], models: [] });

  const fetchData = async (endpoint) => {
    try {
      const url = `${import.meta.env.VITE_BACKEN_URL}/${endpoint}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  };

  useEffect(() => {
    (async () => {
      setOptions({
        languages: (await fetchData("language")).data,
        models: (await fetchData("model")).data,
      });
    })();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    try {
      const { languageId, message, modelId } = formData;
      const data = await fetchData(
        `history/create?modelId=${modelId}&languageId=${languageId}&input=${message}`
      );

      if (data.success) {
        setResult({
          correctedText: data.data.correctedText,
          translation: data.data.translatedText,
          detectedLanguage: data.data.detectedLanguage,
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error during translation:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(result.translation)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div className="translate-container">
      <h1>Translation</h1>
      <form onSubmit={handleOnSubmit}>
        <div className="models">
          {options.models.map((model) => (
            <div key={model.id}>
              <input
                type="radio"
                id={`model-${model.id}`}
                name="modelId"
                value={model.id}
                onChange={handleInputChange}
              />
              <label htmlFor={`model-${model.id}`}>
                {model.name} ({model.type})
              </label>
            </div>
          ))}
        </div>
        <div className="choices">
          {options.languages.map((language) => (
            <div key={language.id}>
              <input
                type="radio"
                id={`language-${language.id}`}
                name="languageId"
                value={language.id}
                onChange={handleInputChange}
              />
              <label htmlFor={`language-${language.id}`}>{language.name}</label>
            </div>
          ))}
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
        {result.detectedLanguage && (
          <div className="textResult">
            <strong>Detected Language:</strong> {result.detectedLanguage}
          </div>
        )}
        <div className="textResult">
          <h3>Corrected Text</h3>
          {isLoading ? <BeatLoader /> : result.correctedText}
        </div>
        <div className="copyDiv">
          <div className="copy-textResult">
            <h3>Translated Text</h3>
            <div>{isLoading ? <BeatLoader /> : result.translation}</div>
          </div>
          <div onClick={handleCopy} className="copy-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>
          </div>
        </div>
      </div>
      {showNotification && (
        <div className="notification active">Copied to clipboard!</div>
      )}
    </div>
  );
};

export default Translate;
