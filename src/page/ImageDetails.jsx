import React, { useState } from "react";
import "../styles/ImageDetails.css"; // Import the CSS file
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";

const ImageDetails = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [imageDetails, setImageDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setImageDetails(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEN_URL}/compareAI/img`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        setImageDetails(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-details-container">
      <h1>Upload Image and Get Details</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={handlePromptChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <BeatLoader /> : "Upload"}
        </button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="output">
        {file && (
          <div className="image-preview">
            <h2>Image Preview</h2>
            <img
              src={URL.createObjectURL(file)}
              alt="Selected File"
              className="preview-img"
            />
          </div>
        )}
        {imageDetails ? (
          <div className="details">
            <h2>Image Details</h2>
            <p>{imageDetails}</p>
          </div>
        ) : (
          loading && <BeatLoader />
        )}
      </div>
    </div>
  );
};

export default ImageDetails;
