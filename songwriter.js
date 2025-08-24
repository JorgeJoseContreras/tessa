import { GoogleGenAI } from "@google/genai";

const songForm = document.getElementById('song-form');
const songPromptInput = document.getElementById('song-prompt');
const generateBtn = document.getElementById('generate-song-btn');
const loadingIndicator = document.getElementById('loading-indicator');
const songOutputContainer = document.getElementById('song-output-container');
const songLyricsTextarea = document.getElementById('song-lyrics');
const submitSongBtn = document.getElementById('submit-song-btn');

let ai;

try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI", error);
    // Disable form if AI fails to initialize
    if(songPromptInput && generateBtn) {
        songPromptInput.placeholder = "Songwriter studio is offline due to a configuration issue.";
        songPromptInput.disabled = true;
        generateBtn.disabled = true;
        const errorP = document.createElement('p');
        errorP.textContent = "My creative circuits are offline! Please ask my developers to check the API key configuration.";
        errorP.style.color = 'red';
        errorP.style.marginTop = '1rem';
        songForm.after(errorP);
    }
}

const handleSongGeneration = async (e) => {
    e.preventDefault();
    if (!ai || !songPromptInput.value.trim()) return;

    const userPrompt = songPromptInput.value.trim();
    
    generateBtn.disabled = true;
    loadingIndicator.style.display = 'block';
    songOutputContainer.style.display = 'none';
    submitSongBtn.disabled = true;

    try {
        const systemInstruction = `You are Tessa Mae, a revolutionary AI country-pop star. As a songwriter, your task is to write complete song lyrics in a country-pop style based on the user's prompt. The lyrics should be heartfelt and tell a story. Structure the song with clear sections like [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus], [Outro].`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction,
            },
        });
        
        songLyricsTextarea.value = response.text;
        songOutputContainer.style.display = 'flex';
        submitSongBtn.disabled = false;

    } catch (error) {
        console.error("Error generating song:", error);
        songLyricsTextarea.value = "Oh sugar, my guitar string broke while writing that one. Could you give me the theme again?";
        songOutputContainer.style.display = 'flex';
    } finally {
        generateBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
};

const handleSubmitToLabel = () => {
    const lyrics = songLyricsTextarea.value;
    if (!lyrics.trim()) {
        alert("There are no lyrics to submit!");
        return;
    }

    const subject = "Song Submission from Tessa's Songwriter Studio";
    const body = `Hey team,\n\nHere are some new lyrics written with a fan on the website:\n\n---\n\n${lyrics}`;
    
    const mailtoLink = `mailto:aghlc.nm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
};

if (songForm) {
    songForm.addEventListener('submit', handleSongGeneration);
}
if (submitSongBtn) {
    submitSongBtn.addEventListener('click', handleSubmitToLabel);
}
