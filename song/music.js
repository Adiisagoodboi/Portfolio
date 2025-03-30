// Define the songs for each artist
const artists = {
    artist1: ["Song 1 - Ek Ladki Bheegi Bhaagi Si", "Song 2 - Mere Mehboob Qayamat", "Song 3 - Zindagi Ek Safar", "Song 4 - Bindu re Bindu ", "Song 5 - Ek Ajnabee Haseena Se"],
    artist2: ["Song 1 - Ek Ladki Ko Dekha", "Song 2 - Ladki Badi Anjani Hai", "Song 3 - Chura Ke Dil Mera", "Song 4 - Ek Sanam Chahiye Aashiqi", "Song 5 - Chand Se Parda"],
    artist3: ["Song 1 - Daffliwale Daffli Baja", "Song 2 - Tumse Mili Nazar", "Song 3 - Zindagi Pyaar Ka Geet Hai", "Song 4 - Ye Sama Hai Ye Pyaar Ka", "Song 5 - Aapki Nazro Ne Samjha"],
    artist4: ["Song 1 - Chura Liya Hai Tumne", "Song 2 - Hum Lakh Chupaye Pyaar", "Song 3 - Ye Raatein Ye Mausam", "Song 4 - In Aankhon Ki Masti", "Song 5 - Jawani Janeman"]
};

const artistBtns = document.querySelectorAll(".artistBtn");
const songListContainer = document.getElementById("songList");
const songSelection = document.getElementById("songSelection");
const player = document.getElementById("player");
const currentSongTitle = document.getElementById("currentSongTitle");
const audioPlayer = document.getElementById("audioPlayer");

// Event listener for selecting an artist
artistBtns.forEach(button => {
    button.addEventListener("click", () => {
        const artist = button.dataset.artist;
        displaySongs(artist);
    });
});

// Function to display the songs of the selected artist
function displaySongs(artist) {
    // Show the song selection section
    songSelection.style.display = "block";
    
    // Empty the previous song list
    songListContainer.innerHTML = "";

    // Create a list of songs for the selected artist
    artists[artist].forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.textContent = song;
        songItem.addEventListener("click", () => {
            playSong(artist, index + 1, song); // Passing artist, song number, and title
        });
        songListContainer.appendChild(songItem);
    });
}

// Function to play the selected song
function playSong(artist, songNumber, songTitle) {
    // Hide the song selection and show the player
    songSelection.style.display = "none";
    player.style.display = "block";

    // Set the song title in the player
    currentSongTitle.textContent = songTitle;

    // Construct the audio file path based on the selected artist and song number
    audioPlayer.src = `song/songs/${artist}/${songNumber}.mp3`; // Each artist has their own folder
    audioPlayer.play();
}
