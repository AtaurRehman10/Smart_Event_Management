import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useSpeech() {
     const [listening, setListening] = useState(false);
     const navigate = useNavigate();
     const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
          ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
          : null;

     useEffect(() => {
          if (!recognition) return;

          recognition.continuous = false;
          recognition.lang = 'en-US';
          recognition.interimResults = false;

          recognition.onstart = () => setListening(true);
          recognition.onend = () => setListening(false);

          recognition.onresult = (event) => {
               const transcript = event.results[0][0].transcript.toLowerCase();
               console.log('Speech command:', transcript);
               handleCommand(transcript);
          };

          return () => recognition.stop();
     }, [recognition]);

     const handleCommand = (cmd) => {
          if (cmd.includes('dashboard')) navigate('/dashboard');
          else if (cmd.includes('events')) navigate('/events');
          else if (cmd.includes('networking')) navigate('/networking');
          else if (cmd.includes('map') || cmd.includes('venue')) navigate('/events/1/venue'); // Placeholder ID
          else if (cmd.includes('search')) navigate('/search');
          else if (cmd.includes('login')) navigate('/login');
          else if (cmd.includes('home')) navigate('/');
     };

     const startListening = () => {
          if (recognition && !listening) recognition.start();
     };

     const stopListening = () => {
          if (recognition && listening) recognition.stop();
     };

     return { listening, startListening, stopListening, isSupported: !!recognition };
}
