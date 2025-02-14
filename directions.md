# Trivia Quiz Exercise

### Setup

1. Open the terminal to the `04-redux-exercise` directory. You can do this by right-clicking on the `04-redux-exercise` folder in VS Code and selecting "Open in Integrated Terminal".

2. In the terminal, type `npm create vite .` and hit enter/return. The `.` will create a new Vite project in the current directory.

3. When prompted, select "Ignore files and continue" to keep existing files in the directory.

4. Choose React and then JavaScript from the following menus, using arrow keys and Enter/Return.

5. Install dependencies by entering `npm install` in the terminal.

6. Install React Redux and Redux by typing `npm i redux react-redux`.

7. Run the app by typing `npm run dev` in the terminal. This will provide a clickable link to open the app in your default browser.

### User Story 1: As a user, I want to enter my name and start the trivia quiz.

**Step 1: Set Up the Redux Store**

1. In your `src` directory, create a file named `store.js`.

2. Inside `store.js`, set up the initial state with a single property: `userName`.

```javascript
const initialState = {
  userName: '',
};
```

3. Create a reducer function named rootReducer to handle the SET_USER_NAME action.

``` javascript
function rootReducer(state = initialState, action) {
  if (action.type === 'SET_USER_NAME') {
    return { ...state, userName: action.payload };
  } else {
    return state;
  }
}
```

4. Create the Redux store using createStore and export it.

```javascript
import { createStore } from 'redux';

const store = createStore(rootReducer);

export default store;
```

**Step 3: Set Up the Main Entry Point**

1. In your `src` directory, create a file named `main.jsx`.

2. Inside `main.jsx`, set up the entry point for your application by importing `StrictMode`, `createRoot`, `Provider`, `BrowserRouter`, `store`, and `App`.

3. Use `createRoot` to render the app within a `StrictMode`, wrapping it with `Provider` (with `store` as its prop) and `BrowserRouter`.

```javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
```

**Step 4: Create the App Component**

1. In your `src` directory, create a file named `App.jsx`.

2. Inside `App.jsx`, create the `App` component by importing the necessary functions from `react-redux`.

3. Use `useDispatch` to create a dispatch function and `useSelector` to access the `userName` state.

4. Define a `handleNameSubmit` function to handle the `SET_USER_NAME` action.

5. Add a `return` statement that displays a form to enter the user's name if `userName` is not set.

6. Export the `App` component.

```javascript
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
  }

  return (
    <div>
      {!userName && (
        <form onSubmit={handleNameSubmit}>
          <label>
            Enter your name:
            <input type="text" name="name" />
          </label>
          <button type="submit">Start</button>
        </form>
      )}

      {userName && (
        <div>
          <h2>Hello, {userName}!</h2>
        </div>
      )}
    </div>
  );
}

export default App;
```

### User Story 2: As a user, I can see the trivia question being asked.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `currentQuestion` and `questions`.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  questions: [
    { id: 1, text: 'What is 2 + 2?', answer: '4', category: 'easy' },
    { id: 2, text: 'What color is the sky?', answer: 'blue', category: 'easy' },
    { id: 3, text: 'What is the capital of France?', answer: 'Paris', category: 'easy' },
    { id: 4, text: 'What planet do we live on?', answer: 'Earth', category: 'easy' },
    { id: 5, text: 'What is H2O?', answer: 'water', category: 'easy' },
  ],
};
```

3. Extend the rootReducer function to handle the NEXT_QUESTION action.

```javascript
function rootReducer(state = initialState, action) {
  if (action.type === 'SET_USER_NAME') {
    return { ...state, userName: action.payload };
  } else if (action.type === 'NEXT_QUESTION') {
    const remainingQuestions = state.questions.filter(
      (q) => !state.questionsAsked.includes(q.id)
    );

    if (remainingQuestions.length === 0) {
      return { ...state, currentQuestion: null };
    }

    const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];

    return {
      ...state,
      currentQuestion: nextQuestion,
      questionsAsked: [...state.questionsAsked, nextQuestion.id],
    };
  } else {
    return state;
  }
}
```

**Step 2: Update the App Component**

1. In your `src` directory, open the `App.jsx` file.

2. Extend the `handleNameSubmit` function to dispatch the `NEXT_QUESTION` action.

3. Use `useSelector` to access the `currentQuestion` state.

4. Add a `return` statement to display the current question if `userName` is set.

```javascript
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type: 'NEXT_QUESTION' });
  }

  return (
    <div>
      {!userName && (
        <form onSubmit={handleNameSubmit}>
          <label>
            Enter your name:
            <input type="text" name="name" />
          </label>
          <button type="submit">Start</button>
        </form>
      )}

      {userName && (
        <div>
          <h2>Hello, {userName}!</h2>
          {currentQuestion && (
            <div>
              <p>{currentQuestion.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
```

### User Story 3: As a user, I can enter an answer and see the results.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `previousQuestion`, `isCorrect`, `questionsAsked`, `correctAnswers`, and `wrongAnswers`.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  previousQuestion: null,
  isCorrect: false,
  questionsAsked: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  questions: [
    { id: 1, text: 'What is 2 + 2?', answer: '4', category: 'easy' },
    { id: 2, text: 'What color is the sky?', answer: 'blue', category: 'easy' },
    { id: 3, text: 'What is the capital of France?', answer: 'Paris', category: 'easy' },
    { id: 4, text: 'What planet do we live on?', answer: 'Earth', category: 'easy' },
    { id: 5, text: 'What is H2O?', answer: 'water', category: 'easy' },
  ],
};
```

3. Extend the rootReducer function to handle the SUBMIT_ANSWER action.

```javascript
function rootReducer(state = initialState, action) {
  if (action.type === 'SET_USER_NAME') {
    return { ...state, userName: action.payload };
  } else if (action.type === 'NEXT_QUESTION') {
    const remainingQuestions = state.questions.filter(
      (q) => !state.questionsAsked.includes(q.id)
    );

    if (remainingQuestions.length === 0) {
      return { ...state, currentQuestion: null };
    }

    const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];

    return {
      ...state,
      previousQuestion: state.currentQuestion,
      currentQuestion: nextQuestion,
      questionsAsked: [...state.questionsAsked, nextQuestion.id],
    };
  } else if (action.type === 'SUBMIT_ANSWER') {
    const isCorrect = action.payload.toLowerCase() === state.currentQuestion.answer.toLowerCase();

    return {
      ...state,
      isCorrect: isCorrect,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      wrongAnswers: isCorrect ? state.wrongAnswers : state.wrongAnswers + 1,
    };
  } else {
    return state;
  }
}
```

**Step 2: Update the App Component**

1. In your `src` directory, open the `App.jsx` file.

2. Extend the `handleNameSubmit` function to dispatch the `NEXT_QUESTION` action.

3. Use `useSelector` to access the `currentQuestion` state.

4. Add a `return` statement to display the current question and an input field if `userName` is set.

5. Define a `handleSubmit` function to handle the submission of an answer. This function should dispatch the `SUBMIT_ANSWER` action with the user's input as the payload.

6. Update the JSX to include a form for submitting the answer.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const [answer, setAnswer] = useState('');

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type: 'NEXT_QUESTION' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
    setAnswer('');
  }

  return (
    <div>
      {!userName && (
        <form onSubmit={handleNameSubmit}>
          <label>
            Enter your name:
            <input type="text" name="name" />
          </label>
          <button type="submit">Start</button>
        </form>
      )}

      {userName && (
        <div>
          <h2>Hello, {userName}!</h2>
          {currentQuestion && (
            <div>
              <p>{currentQuestion.text}</p>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
```

### User Story 4: As a user, I can see the next trivia question immediately after submitting an answer.

**Step 1: Extend the App Component**

1. In your `src` directory, open the `App.jsx` file.

2. Extend the `handleSubmit` function to dispatch the `NEXT_QUESTION` action after submitting the answer.

3. Add a `useEffect` hook to reset the answer input when the next question is loaded.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const [answer, setAnswer] = useState('');

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type: 'NEXT_QUESTION' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
    dispatch({ type: 'NEXT_QUESTION' });
    setAnswer('');
  }

  useEffect(() => {
    setAnswer('');
  }, [currentQuestion]);

  return (
    <div>
      {!userName && (
        <form onSubmit={handleNameSubmit}>
          <label>
            Enter your name:
            <input type="text" name="name" />
          </label>
          <button type="submit">Start</button>
        </form>
      )}

      {userName && (
        <div>
          <h2>Hello, {userName}!</h2>
          {currentQuestion && (
            <div>
              <p>{currentQuestion.text}</p>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
```

### User Story 5: As a user, I can see if my answer was correct.

**Step 1: Create the ResultsCard Component**

1. In your `src` directory, create a file named `ResultsCard.jsx`.

2. Inside `ResultsCard.jsx`, create the `ResultsCard` component by importing `useSelector` from `react-redux`.

3. Use `useSelector` to access the `isCorrect` and `previousQuestion` state properties.

4. Add a `return` statement that displays the previous question text, the correct answer, and a message indicating whether the user's answer was correct.

5. Export the `ResultsCard` component.

```javascript
import { useSelector } from 'react-redux';

function ResultsCard() {
  const isCorrect = useSelector((state) => state.isCorrect);
  const question = useSelector((state) => state.previousQuestion);

  return (
    <div>
      <h3>Previous Question:</h3>
      <p>{question.text}</p>
      <p>Answer: {question.answer}</p>
      <h3>{isCorrect ? 'Correct!' : 'Try the next question...'}</h3>
    </div>
  );
}

export default ResultsCard;
```

**Step 2: Update the App Component to Include ResultsCard**

1. In your `src` directory, open the `App.jsx` file.

2. Import the `ResultsCard` component.

3. Use `useSelector` to access the `previousQuestion` state.

4. Add a `return` statement to display the `ResultsCard` component below the trivia form.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ResultsCard from './ResultsCard';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const previousQuestion = useSelector((state) => state.previousQuestion);
  const [answer, setAnswer] = useState('');

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type: 'NEXT_QUESTION' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
    dispatch({ type: 'NEXT_QUESTION' });
    setAnswer('');
  }

  useEffect(() => {
    setAnswer('');
  }, [currentQuestion]);

  return (
    <div>
      {!userName && (
        <form onSubmit={handleNameSubmit}>
          <label>
            Enter your name:
            <input type="text" name="name" />
          </label>
          <button type="submit">Start</button>
        </form>
      )}

      {userName && (
        <div>
          <h2>Hello, {userName}!</h2>
          {currentQuestion && (
            <div>
              <p>{currentQuestion.text}</p>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
          {previousQuestion && <ResultsCard />}
        </div>
      )}
    </div>
  );
}

export default App;
```

### User Story 6: As a user, I can complete the quiz and see my results.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `totalQuestions` and update `questionsAsked` to count the number of questions asked.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  previousQuestion: null,
  isCorrect: false,
  questionsAsked: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalQuestions: 5,
  questions: [
    { id: 1, text: 'What is 2 + 2?', answer: '4', category: 'easy' },
    { id: 2, text: 'What color is the sky?', answer: 'blue', category: 'easy' },
    { id: 3, text: 'What is the capital of France?', answer: 'Paris', category: 'easy' },
    { id: 4, text: 'What planet do we live on?', answer: 'Earth', category: 'easy' },
    { id: 5, text: 'What is H2O?', answer: 'water', category: 'easy' },
  ],
};
```

3. Update the rootReducer function to increment the questionsAsked count when a question is answered.

```javascript
function rootReducer(state = initialState, action) {
  if (action.type === 'SET_USER_NAME') {
    return { ...state, userName: action.payload };
  } else if (action.type === 'NEXT_QUESTION') {
    const remainingQuestions = state.questions.filter(
      (q) => !state.questionsAsked.includes(q.id)
    );

    if (remainingQuestions.length === 0) {
      return { ...state, currentQuestion: null };
    }

    const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];

    return {
      ...state,
      previousQuestion: state.currentQuestion,
      currentQuestion: nextQuestion,
      questionsAsked: state.questionsAsked + 1,
    };
  } else if (action.type === 'SUBMIT_ANSWER') {
    const isCorrect = action.payload.toLowerCase() === state.currentQuestion.answer.toLowerCase();

    return {
      ...state,
      isCorrect: isCorrect,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      wrongAnswers: isCorrect ? state.wrongAnswers : state.wrongAnswers + 1,
    };
  } else {
    return state;
  }
}
```

**Step 2: Update the App Component to Display the Total Results**

1. In your `src` directory, open the `App.jsx` file.

2. Use `useSelector` to access the `correctAnswers`, `wrongAnswers`, and `totalQuestions` state.

3. Add a `return` statement to display the total results when the quiz is completed.

4. Update the JSX to include a message showing the total correct and wrong answers.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ResultsCard from './ResultsCard';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const previousQuestion = useSelector((state) => state.previousQuestion);
  const correctAnswers = useSelector((state) => state.correctAnswers);
  const wrongAnswers = useSelector((state) => state.wrongAnswers);
  const totalQuestions = useSelector((state) => state.totalQuestions);
  const questionsAsked = useSelector((state) => state.questionsAsked);
  const [answer, setAnswer] = useState('');

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type: 'NEXT_QUESTION' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
    dispatch({ type: 'NEXT_QUESTION' });
    setAnswer('');
  }

  useEffect(() => {
    setAnswer('');
  }, [currentQuestion]);

  return (
    <div>
      {!userName && (
        <form onSubmit={handleNameSubmit}>
          <label>
            Enter your name:
            <input type="text" name="name" />
          </label>
          <button type="submit">Start</button>
        </form>
      )}

      {userName && (
        <div>
          <h2>Hello, {userName}!</h2>
          {currentQuestion && questionsAsked < totalQuestions && (
            <div>
              <p>{currentQuestion.text}</p>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
          {previousQuestion && <ResultsCard />}
          {questionsAsked >= totalQuestions && (
            <div>
              <p>Quiz Completed!</p>
              <p>Total Correct: {correctAnswers}</p>
              <p>Total Wrong: {wrongAnswers}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
```

### Wrapping Up

Here's a summary of what we've accomplished:

- Created a React application using Vite.
- Set up Redux for state management.
- Built the functionality to allow users to enter their name.
- Displayed trivia questions to the user.
- Allowed users to submit answers and see results.
- Showed the next question immediately after submitting an answer.
- Displayed the total results when the quiz is completed.

Well done!

### Bonuses

If you want to take this exercise further, here are some additional features you can implement, in rough order of complexity:

- Add the ability to restart the quiz after completing it.
- Implement a scoring system to award points for correct answers.
- Include different categories for the trivia questions, and allow the user to select a category.
- Add a timer to limit the time for answering each question.
