import React, { useEffect, useState, useRef } from "react";

function TextToSpeechAndSpeechToText() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const speechSynthesis = window.speechSynthesis;

    const loadVoices = () => {
      const getVoices = speechSynthesis.getVoices();
      setVoices(getVoices);
      setSelectedVoice(getVoices[0]);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function handleVoiceChange(e) {
    setSelectedVoice(voices[e.target.value]);
  }

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleSpeak() {
    if (text) {
      if (!isListening) {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        // setIsSpeaking(true);
      } else {
        window.alert("Listening is ON Stop Listening");
      }
    } 
    else if (text === "") {
      if (isListening) {
        window.alert("Listening is ON Stop Listening");
      } else {
        window.alert("textarea is empty");
      }
    }
  }

  function handleStop() {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  const startListening = () => {
    if (isSpeaking === false) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        setText((prevText) => prevText + " " + transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  return (
    <div className="bg-slate-600 h-screen px-4 md:px-8 flex flex-col items-center justify-center text-white">
      <div className="flex flex-col w-full max-w-3xl">
        <p className="text-xl md:text-3xl font-bold text-center mb-6">
          <span className="text-red-500">Text to Speech</span>{" "}
          <span className="text-black/50">&</span>{" "}
          <span className="text-blue-500">Speech to Text</span> {" "}
          <span className="text-black/50">Converter</span>
        </p>

        <textarea
          placeholder="Your text here"
          value={text}
          onChange={handleTextChange}
          name="textArea"
          className="w-full flex-shrink h-48 md:h-56 lg:h-64 bg-black/50 text-white text-base md:text-xl p-4 rounded-lg mb-5"
        ></textarea>

        <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
          <select
            className="h-12 w-full md:w-1/2 lg:w-1/3 text-base text-white bg-black/50 p-2 rounded-md"
            onChange={handleVoiceChange}
          >
            {voices.map((voice, index) => (
              <option value={index} key={index}>
                {voice.name}
              </option>
            ))}
          </select>


          <button
            onClick={isSpeaking ? handleStop : handleSpeak}
            className="w-full md:w-20 h-11 rounded-lg bg-red-500 hover:bg-red-600 text-base md:text-lg p-2 px-0 md:px-4 "
          >
            {isSpeaking ? "Stop" : "Speak"}
          </button>

          <button
            className="w-full md:w-auto text-white bg-blue-600 hover:bg-blue-700 text-base md:text-lg p-2 px-0 md:px-4 rounded-lg flex items-center justify-center"
            onClick={isListening ? stopListening : startListening}
          >
            <img
              src={
                isListening
                  ? "https://icon-library.com/images/stop-icon-png/stop-icon-png-14.jpg"
                  : "https://icon-library.com/images/microphone-icon-png/microphone-icon-png-16.jpg"
              }
              alt={isListening ? "Stop Icon" : "Microphone Icon"}
              className="w-5 h-5 mr-2"
            />
            {isListening ? "Stop Listening" : "Start Listening"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextToSpeechAndSpeechToText;
