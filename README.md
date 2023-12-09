# ASR-Cloud-Translation with express.js

An experimental application merging real-time Automatic Speech Recognition (ASR) with Cloud Translation. This project utilizes WebSocket.io, RecordRTC, socket.io-stream, and Express.js to capture speech, convert it to text via ASR, and instantly translate it into various languages. 

## Overview

Hey there! So, imagine this cool thing I've been working on—it's like this foundation to breaking language barriers! You know, like when you talk in one language, and It instantly translates into another language in real time. 

Basically, I built this app that lets you talk in, let's say, English, and it turns into text. It then translates that text into tons of other languages quickly, 

I used like WebSocket.io, RecordRTC (for recording sound), socket.io-stream (for sending stuff back and forth), and Express.js (to help manage everything behind the scenes).

I'm not a pro or anything; this is my first project using (sockets,express,RecordRTC,Webrtc) , but I hope it gives developers out there a head start in creating something similar in the future.

This projects aims to help folks easily understand each other in real time, no matter what language they speak through chat or even audio/video call.

## Key Features

- **Real-time Speech Recognition**: Capture and transcribe speech in real time using RecordRTC and WebSocket.io.
- **Multi-language Translation**: Instantly translate transcribed text into various languages leveraging Cloud Translation.
-  **WEBRTC**: be able to implent this in a video/audio call using WEBRTC.(TBA)

## Dependencies

This project relies on the following dependencies:

- **Node.js**: A JavaScript runtime for server-side programming.
- **Express.js**: A web application framework for Node.js, handling server-side operations.
- **WebSocket.io**: Enables real-time communication between clients and servers.
- **RecordRTC**: A WebRTC library for audio and video recording.
- **socket.io-stream**: Allows bi-directional streaming with Socket.IO.

## Setting Up
(Note: Before Starting this requires Google Cloud Platform with billing enabled )

To run this application, follow these steps:

1. **Install Node.js**: Ensure you have Node.js installed on your machine.

2. **Install Dependencies**: Run `npm install` to install the required dependencies listed in `package.json`.

3. **Obtain Google Cloud Service Account Credentials**:
   - Acquire a `service_account.json` file from the Google Cloud Platform.
   - Place the `service_account.json` file inside the `credentials` folder in this project.
   - For guidance on creating service account keys, refer to [Google Cloud documentation](https://cloud.google.com/iam/docs/keys-create-delete).


4. **Configure Google Cloud Project ID**:(optional) 
   - Open `src/index.js`.
   - Replace the value for the project ID with your actual Google Cloud Project ID.

5. **Run the Application**:
   - Execute the provided `.bat` file or navigate to the `src` directory and run `node index.js` in the terminal to start the server.

## Usage

Once the server is running, access the application through a web browser - [localhost:8080](http://localhost:8080), 
you can change the primary language( which is your spoken language), and you can also change the text it will translate to.

## Contributions

Contributions, issues, and feature requests are welcome. Feel free to fork and submit pull requests to enhance the functionality of this experimental ASR and Cloud Translation application.

## License

This project is licensed under the Apache License, Version 2.0. Refer to the [LICENSE] file for more details.

## References
[TBA]

