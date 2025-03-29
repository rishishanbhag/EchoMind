import { useState } from "react"

export default function ViteLanding() {
  const [input, setInput] = useState("")   // State for text input
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [output, setOutput] = useState("")
  const [outputImage, setOutputImage] = useState(null)

  const handleTextChange = (e) => {
    setInput(e.target.value)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview URL for image
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (input) {
      try {
        const response =  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        }
        const res = await fetch("http://localhost:3000/gemini", response) // Adjust the URL as needed

        if (!response.ok) {
          throw new Error("Failed to fetch data from the server")
        }

        const data = await response.json()
        setOutput(data.result || "No result provided")
        setOutputImage(null)
      } catch (error) {
        console.error("Error fetching response:", error)
        setOutput("Error fetching response")
        setOutputImage(null)
      }
    } else if (previewUrl) {
      setOutput("Image submission is not yet implemented")
      setOutputImage(previewUrl)
    } else {
      setOutput("No input provided")
      setOutputImage(null)
    }
  }

  const handleClear = () => {
    setInput("")
    setFile(null)
    setPreviewUrl(null)
    setOutput("")
    setOutputImage(null)
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="w-full py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center">WELCOME</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Input section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b-2 border-black pb-2">Input</h2>
            <div className="p-6 border-2 border-black rounded-md bg-white">
              <div className="space-y-4">
                {/* Custom Textarea */}
                <textarea
                  placeholder="Enter your text here..."
                  className="w-full min-h-[120px] p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  value={input}
                  onChange={handleTextChange} //TEXT CHANGE 
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    {/* Custom File Upload */}
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
                  </div>

                  {/* Custom Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="h-12 px-6 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        Submit
                      </div>
                    </button>

                    <button
                      onClick={handleClear}
                      className="h-12 px-6 border-2 border-black text-black rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="border border-black rounded-md p-2 inline-block">
                      <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-40" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Output section */}
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
          <p className="text-center text-black">© {new Date().getFullYear()} Vite Landing Page</p>
        </div>
      </footer>
    </div>
  )
}
