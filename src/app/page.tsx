'use client';

import { useState, useEffect } from 'react';
import Quiz from '@/components/Quiz';

export default function Home() {
  const [category, setCategory] = useState('9');
  const [started, setStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      {!started ? (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Trivia Quiz</h1>
          <div className="mb-4">
            <label className="block mb-2">Select Category:</label>
            <select
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="9">General Knowledge</option>
              <option value="10">Entertainment: Books</option>
              <option value="11">Entertainment: Film</option>
              <option value="12">Entertainment: Music</option>
              <option value="13">Entertainment: Musicals & Theatres</option>
              <option value="14">Entertainment: Television</option>
              <option value="15">Entertainment: Video Games</option>
              <option value="16">Entertainment: Board Games</option>
              <option value="17">Science & Nature</option>
              <option value="18">Science: Computers</option>
              <option value="19">Science: Mathematics</option>
              <option value="20">Mythology</option>
              <option value="21">Sports</option>
              <option value="22">Geography</option>
              <option value="23">History</option>
              <option value="24">Politics</option>
              <option value="25">Art</option>
              <option value="26">Celebrities</option>
              <option value="27">Animals</option>
              <option value="28">Vehicles</option>
              <option value="29">Entertainment: Comics</option>
              <option value="30">Science: Gadgets</option>
              <option value="31">Entertainment: Japanese Anime & Manga</option>
              <option value="32">Entertainment: Cartoon & Animations</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setStarted(true)}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <Quiz category={category} />
      )}
    </main>
  );
}
