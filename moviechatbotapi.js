const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Set up the IMDb API credentials (get your own from http://www.omdbapi.com/apikey.aspx)
const imdbApiKey = process.env.IMDB_API_KEY;

// Initialize the Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = 'Welcome to the Movie Chat Bot!';

  bot.sendMessage(chatId, welcomeMessage);
});

// Handle the /hi command
bot.onText(/\/hi/, (msg) => {
  const chatId = msg.chat.id;
  const hiMessage = 'Hello there! Enter /movie movie_name  to Display the movie Details!';

  bot.sendMessage(chatId, hiMessage);
});

// Handle the /bye command
bot.onText(/\/bye/, (msg) => {
  const chatId = msg.chat.id;
  const byeMessage = 'Goodbye! Have a great day!';

  bot.sendMessage(chatId, byeMessage);
});

// Handle the /movie command
bot.onText(/\/movie (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const movieName = match[1];

  try {
    // Call the IMDb API to get the movie details
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${imdbApiKey}&t=${encodeURIComponent(movieName)}`);
    const movieData = response.data;

    // Send the movie details to the user
    bot.sendPhoto(chatId, movieData.Poster, { caption: movieData.Title });
    bot.sendMessage(chatId, `Director: ${movieData.Director}`);
    bot.sendMessage(chatId, `Rating: ${movieData.imdbRating}`);
    bot.sendMessage(chatId, `Release Date: ${movieData.Released}`);
    bot.sendMessage(chatId, `Teaser: ${movieData.Plot}`);
    bot.sendMessage(chatId, `IMDb Link: https://www.imdb.com/title/${movieData.imdbID}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Sorry, I could not find the movie.');
  }
});

// Start the bot
console.log('Bot is running...');

