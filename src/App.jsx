import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [captionResponse, setCaptionResponse] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Handle file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a preview for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle text-based chat
  const handleChatSubmit = async () => {
    setLoadingChat(true);
    try {
      const result = await model.generateContent([chatInput]);
      setChatResponse(result?.response?.text || "No response received.");
    } catch (error) {
      console.error("Error generating chat response:", error);
      setChatResponse("Error processing your input. Try again later.");
    } finally {
      setLoadingChat(false);
      setChatInput("");
    }
  };

  // Handle image captioning with a user-provided prompt
  const handleImageCaptioning = async () => {
    if (!selectedFile) {
      setErrorMsg("Please upload an image first.");
      return;
    }
    if (!imagePrompt) {
      setErrorMsg("Please enter a prompt for the image.");
      return;
    }

    setLoadingImage(true);
    setErrorMsg("");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const image = {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: selectedFile.type,
          },
        };

        const result = await model.generateContent([imagePrompt, image]);
        setCaptionResponse(result?.response?.text || "No caption generated.");
      };
      reader.readAsDataURL(selectedFile);
      setImagePrompt("");
    } catch (error) {
      console.error("Error generating caption:", error);
      setErrorMsg("Couldn't generate caption. Please try again.");
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Gemini Chatbot with Image Processing</h1>

      <div>
        <h2>Chat</h2>
        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask something..."
          rows="4"
          cols="50"
        />
        <br />
        <button onClick={handleChatSubmit} style={{ marginTop: "1rem" }}>
          {loadingChat ? "Processing..." : "Send"}
        </button>
        {chatResponse && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#f1f1f1" }}>
            <strong>AI Response:</strong> {chatResponse}
          </div>
        )}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* Image Upload and Captioning Section */}
      <div>
        <h2>Image Processing</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={preview}
              alt="Uploaded Preview"
              style={{ maxWidth: "100%", maxHeight: "200px", border: "1px solid #ccc" }}
            />
          </div>
        )}
        <textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          placeholder="Enter a prompt for the image (e.g., 'Generate a cool caption with emojis')"
          rows="4"
          cols="50"
          style={{ marginTop: "1rem" }}
        />
        <br />
        <button onClick={handleImageCaptioning} style={{ marginTop: "1rem" }}>
          {loadingImage ? "Generating..." : "Process Image"}
        </button>
        {errorMsg && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            <strong>{errorMsg}</strong>
          </div>
        )}
        {captionResponse && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#f1f1f1" }}>
            <strong>Caption Response:</strong> {captionResponse}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
