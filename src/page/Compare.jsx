import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/compare.css";
import { BeatLoader } from "react-spinners";

const Compare = () => {
  const [models, setModels] = useState([]);
  const [groupedModels, setGroupedModels] = useState({});
  const [selectedModels, setSelectedModels] = useState({});
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [message, setMessage] = useState("");
  const [outputs, setOutputs] = useState({
    result: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEN_URL}/model`
        );
        const data = await response.json();
        setModels(data.data);
        groupModelsByType(data.data);
      } catch (err) {
        console.error("Error fetching models:", err);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEN_URL}/language`
        );
        const data = await response.json();
        setLanguages(data.data);
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };

    fetchModels();
    fetchLanguages();
  }, []);

  const groupModelsByType = (models) => {
    const grouped = models.reduce((acc, model) => {
      acc[model.type] = acc[model.type] || [];
      acc[model.type].push(model);
      return acc;
    }, {});
    setGroupedModels(grouped);
  };

  const handleModelChange = (e, type, index) => {
    const modelId = e.target.value;
    setSelectedModels((prevSelectedModels) => ({
      ...prevSelectedModels,
      [`${type}-${index}`]: modelId,
    }));
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    const modelIds = Object.entries(selectedModels).map(([key, modelId]) => ({
      type: key.split("-")[0],
      id: modelId,
    }));

    if (modelIds.length === 2 && selectedLanguage && message) {
      const modelIdParams = modelIds.reduce((acc, { type, id }) => {
        acc += `&modelId${type}=${id}`;
        return acc;
      }, "");

      try {
        const url = `${
          import.meta.env.VITE_BACKEN_URL
        }/compareAI?languageId=${selectedLanguage}&input=${encodeURIComponent(
          message
        )}${modelIdParams}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setOutputs(data.data);
        }
      } catch (err) {
        console.error("Error comparing models:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="compare-container">
      <h1>Compare AI Models</h1>
      <form onSubmit={handleCompare}>
        <div className="select-container-outer">
          {Object.keys(groupedModels).map((type, index) => (
            <div key={type} className="select-container">
              <label htmlFor={`model-select-${type}-${index}`}>
                Select Model from {type}:
              </label>
              <select
                id={`model-select-${type}-${index}`}
                value={selectedModels[`${type}-${index}`] || ""}
                onChange={(e) => handleModelChange(e, type, index)}
              >
                <option value="">Select a model</option>
                {groupedModels[type].map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.type})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="input-container">
          <label htmlFor="message-input">Enter Message:</label>
          <textarea
            id="message-input"
            value={message}
            onChange={handleMessageChange}
            rows="4"
          />
        </div>
        <div className="radio-container">
          <label>Select Language:</label>
          <div className="language-radio">
            {languages.map((language) => (
              <label key={language.id}>
                <input
                  type="radio"
                  name="language"
                  value={language.id}
                  checked={selectedLanguage == language.id}
                  onChange={handleLanguageChange}
                />
                {language.name}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <BeatLoader /> : "Compare"}
        </button>
      </form>

      <div className="output-container">
        {outputs.result.map((output, i) => (
          <div key={i} className="model-card">
            <h3>
              {output.model.name} ({output.model.type})
            </h3>
            <p>
              <strong>Translated Text:</strong> {output.translatedText}
            </p>
            <p>
              <strong>Corrected Text:</strong> {output.correctedText}
            </p>
            <p>
              <strong>Detected Language:</strong> {output.detectedLanguage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
