// Required modules
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");
const http = require("http");
const cors = require("cors");
const express = require("express");
const ss = require("socket.io-stream");
const speech = require("@google-cloud/speech");
const { TranslationServiceClient } = require("@google-cloud/translate");

// Setting Google Cloud service account credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = "../credentials/service_account.json";

// Open external URLs in the default browser
const opn = require("opn");

// Initializing Express app
const app = express();

// Initializing Translation Service Client
const translationClient = new TranslationServiceClient();

// Initializing variables for server, speech client, and socket.io
let server, speechClient, io;

// Default languages for translation
let targetLanguage = "en";
let sourceLanguage = "en";
let sourceLanguageCode = "en";

// Function to set up the server
function setupServer() {
  // Configuration object for speech recognition
  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
      audioChannelCount: 1,
      maxAlternatives: 1,
      model: "default",
      useEnhanced: true,
    },
    interimResults: false,
  };

  // Function to configure speech recognition based on language code
  function configureSpeechRecognition(languageCode) {
    request.config.languageCode = languageCode;
    sourceLanguageCode = languageCode;
    sourceLanguage = languageCode;
    console.log(`Language code updated to ${languageCode}`);
  }

  // Function to translate text using Google Cloud Translation API
  async function translateText(text, targetLanguage) {
    const request = {
      parent: `projects/${process.env.GOOGLE_PROJECT_ID || "Insert_Project _ID_here"}`,
      contents: [text],
      mimeType: "text/plain",
      sourceLanguageCode: sourceLanguageCode,
      targetLanguageCode: targetLanguage,
    };

    try {
      const [response] = await translationClient.translateText(request);
      return response.translations[0].translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return ""; // Return empty string if translation fails
    }
  }

  // Function to handle transcription events from the client
  function handleTranscription(client) {
    // Event listener for changing the target language
    client.on("change-target-language", (selectedLanguage) => {
      console.log(`Changing target language to ${selectedLanguage}`);
      targetLanguage = selectedLanguage || "en";
    });

    // Event listener for changing the source language
    client.on("change-source-language", (selectedLanguage) => {
      console.log(`Changing source language to ${selectedLanguage}`);
      sourceLanguage = selectedLanguage || "en";
    });

    // Event listener for streaming and transcribing speech
    ss(client).on("stream-transcribe", function (stream, data) {
      const filename = path.basename(data.name);
      stream.pipe(fs.createWriteStream(filename));

      const translationRequest = {
        parent: `projects/${process.env.GOOGLE_PROJECT_ID || "Insert_Project _ID_here"}`,
        contents: [data.text],
        mimeType: "text/plain",
        sourceLanguageCode: sourceLanguageCode,
        targetLanguageCode: targetLanguage,
      };

      const recognizeStream = speechClient
        .streamingRecognize(request)
        .on("data", function (data) {
          const transcribedText = data.results[0].alternatives[0].transcript;

          if (sourceLanguage === targetLanguage) {
            client.emit("translated-text", transcribedText);
          } else {
            translateText(transcribedText, targetLanguage)
              .then((translatedText) => {
                client.emit("translated-text", translatedText);
              })
              .catch((error) => {
                console.error("Error during translation:", error);
                client.emit("translation-error", "Error occurred during translation");
              });
          }
        })
        .on("error", (e) => {
          console.log(e);
        })
        .on("end", () => {
          // Handling end of transcription
        });

      stream.pipe(recognizeStream);
      stream.on("end", function () {
        // Handling end of stream
      });
    });

    // Event listener for changing the language code
    client.on("change-language-code", (newLanguageCode) => {
      configureSpeechRecognition(newLanguageCode);
    });
  }

  // Function to start the server
  function startServer() {
    // Creating an HTTP server using Express app
    server = http.createServer(app);
    io = socketIo(server);

    // Configuring CORS for Express app
    app.use(cors());

    // Serving the HTML file on root route
    app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname, "/index.html"));
    });

    // Serving the languages JSON file
    app.get("/languages.json", (req, res) => {
      res.sendFile(path.join(__dirname, "/languages.json"));
    });

    // Setting the port for the server to listen to
    const port = 8080;
    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`Server is running on port ${url}`);
      // Open the URL in the default browser
      opn(url);
    });

    // Handling socket.io connection events
    io.on("connect", handleTranscription);

    // Initializing Google Cloud Speech client
    speechClient = new speech.SpeechClient();
  }

  // Start the server setup and execution
  startServer();
}

// Calling the setupServer function to initialize the server
setupServer();
