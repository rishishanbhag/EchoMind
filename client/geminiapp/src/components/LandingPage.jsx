import { useState } from "react";

export default function ViteLanding() {
  const [input, setInput] = useState(""); // Text input
  const [file, setFile] = useState(null); // Image input
  const [output, setOutput] = useState(""); // AI response
  const [outputImage, setOutputImage] = useState(null);

  const handleTextChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    
    if (input) {
      formData.append("chat", input);
    }

    if (file) {
      formData.append("image", file);
    }

    try {
      // Use environment variable for API URL, fallback to your deployed backend
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://echo-mind-backend.vercel.app';
      const res = await fetch(`${API_BASE_URL}/api/image-chat`, {
        method: "POST",
        body: formData, // FormData includes both text & image
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data from the server: ${res.statusText}`);
      }

      const data = await res.json();
      setOutput(data.text || "No response from server");
      setOutputImage(null);
    } catch (error) {
      console.error("Error fetching response:", error);
      setOutput("Error fetching response");
      setOutputImage(null);
    }
  };

  const handleClear = () => {
    setInput("");
    setFile(null);
    setOutput("");
    setOutputImage(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="w-full py-16 bg-white text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center">WELCOME</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Input Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b-2 border-black pb-2">Input</h2>
            <div className="p-6 border-2 border-black rounded-md bg-white">
              <div className="space-y-4">
                {/* Text Input */}
                <textarea
                  placeholder="Enter your text here..."
                  className="w-full min-h-[120px] p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  value={input}
                  onChange={handleTextChange}
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* File Upload */}
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-black rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span>{file ? file.name : "Upload image"}</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="h-12 px-6 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      onClick={handleClear}
                      className="h-12 px-6 border-2 border-black text-black rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b-2 border-black pb-2">Output</h2>
            <div className="p-6 min-h-[200px] border-2 border-black rounded-md bg-gray-50">
              {output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : outputImage ? (
                <div className="flex justify-center">
                  <img
                    src={outputImage || "/placeholder.svg"}
                    alt="Output"
                    className="max-h-[400px] border border-black"
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">Output will appear here</div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t-2 border-black">
        <div className="container mx-auto px-4">
          <p className="text-center text-black">© {new Date().getFullYear()} Made with ❤️ by Rishi</p>
        </div>
      </footer>
    </div>
  );
}
