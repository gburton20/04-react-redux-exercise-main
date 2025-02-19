# Trivia Quiz Exercise

### Setup

1. Open the terminal to the `04-redux-exercise` directory. You can do this by right-clicking on the `04-redux-exercise` folder in VS Code and selecting "Open in Integrated Terminal".

2. In the terminal, type `npm create vite .` and hit enter/return. The `.` will create a new Vite project in the current directory.

3. When prompted, select "Ignore files and continue" to keep existing files in the directory.

4. Choose React and then JavaScript from the following menus, using arrow keys and Enter/Return.

5. Install dependencies by entering `npm install` in the terminal.

6. Install React Redux and Redux by typing `npm install redux react-redux`.

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

At the top of `store.js`:

```javascript
import { createStore } from 'redux';
```

And at the bottom:

```javascript

const store = createStore(rootReducer);

export default store;
```

**Step 3: Set Up the Main Entry Point**

1. In your `src` directory, create a file named `main.jsx`.

2. Inside `main.jsx`, import `Provider` from `react-redux` and `store` from `store.js`.

3. In the return statement, wrap your App component with `Provider`, giving it the `store` prop set to your Redux store.

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
	  <App />
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

**To Confirm**: You should now see a form to enter your name when you run the app. After submitting your name, you should see a greeting message.

### User Story 2: As a user, I can see the trivia question being asked.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `currentQuestion`, `questions`, and `questionsAsked`.

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

It will randomly select a question from the list of questions that have not been asked yet.

```javascript
function rootReducer(state = initialState, action) {
  if (action.type === 'SET_USER_NAME') {
    return { ...state, userName: action.payload };
  } else if (action.type === 'NEXT_QUESTION') {
    const nextQuestion = state.questions[Math.floor(Math.random() * state.questions.length)];

    return {
      ...state,
      currentQuestion: nextQuestion,
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

4. Add to the `return` statement to display the current question if `userName` is set.

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

**To Confirm**: You should now see a trivia question after entering your name and submitting the form. Try reloading and entering your name again to see another random question--you may have to do this a couple of times if it randomly selects the same question.

### User Story 3: As a user, I can enter an answer and see if I got it right.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `isCorrect`.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  isCorrect: false,
  questionsAsked: [],
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
    const nextQuestion = state.questions[Math.floor(Math.random() * state.questions.length)];

    return {
      ...state,
      currentQuestion: nextQuestion,
    };
  } else if (action.type === 'SUBMIT_ANSWER') {
    const isCorrect = action.payload.toLowerCase() === state.currentQuestion.answer.toLowerCase();

    return {
      ...state,
      isCorrect: isCorrect,
    };
  } else {
    return state;
  }
}
```

**Step 2: Update the App Component**

1. In your `src` directory, open the `App.jsx` file.

3. Use `useSelector` to access the `isCorrect` state.

5. Define a `handleSubmit` function to handle the submission of an answer. This function should dispatch the `SUBMIT_ANSWER` action with the user's input as the payload.

6. Update the JSX to include a form for submitting the answer, managing the state of the current answer as it's typed in.

7. Add a paragraph to display whether the answer was correct.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const isCorrect = useSelector((state) => state.isCorrect);
  const [answer, setAnswer] = useState('');

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type: 'NEXT_QUESTION' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
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
      
      {isCorrect !== null && (
        <p>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
      )}
    </div>
  );
}

export default App;
```

**To Confirm**: You should now see a message indicating whether your answer was correct after submitting it.

### User Story 4: As a user, I can see the next trivia question immediately after submitting an answer.

**Step 1: Extend the App Component**

1. In your `src` directory, open the `App.jsx` file.

2. Extend the `handleSubmit` function to dispatch the `NEXT_QUESTION` action after submitting the answer.

3. Reset the answer state after the submission so that the input box is cleared.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const isCorrect = useSelector((state) => state.isCorrect);
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
      
      {isCorrect !== null && (
        <p>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
      )}
    </div>
  );
}

export default App;
```

**To Confirm**: You should now see the next trivia question immediately after submitting an answer. You may have to answer the same question twice--we're not checking for duplicates yet.

### User Story 5: As a user, when I answer a question, I get a new question that I haven't seen before.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `questionsAsked`.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  isCorrect: null,
  questionsAsked: [],
  questions: [
	{ id: 1, text: 'What is 2 + 2?', answer: '4', category: 'easy' },
	{ id: 2, text: 'What color is the sky?', answer: 'blue', category: 'easy' },
	{ id: 3, text: 'What is the capital of France?', answer: 'Paris', category: 'easy' },
	{ id: 4, text: 'What planet do we live on?', answer: 'Earth', category: 'easy' },
	{ id: 5, text: 'What is H2O?', answer: 'water', category: 'easy' },
  ],
};
```

3. Extend the rootReducer function to update the `questionsAsked` array when a question is answered.

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
  } else if (action.type === 'SUBMIT_ANSWER') {
	const isCorrect = action.payload.toLowerCase() === state.currentQuestion.answer.toLowerCase();

	return {
	  ...state,
	  isCorrect: isCorrect,
	};
  } else {
	return state;
  }
}
```

**To Confirm**: You should now see a new question after submitting an answer, and you should not see the same question twice.

### User Story 6: As a user, I can see the previous question and its correct answer.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `previousQuestion`.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  previousQuestion: null,
  isCorrect: null,
  questionsAsked: [],
  questions: [
	{ id: 1, text: 'What is 2 + 2?', answer: '4', category: 'easy' },
	{ id: 2, text: 'What color is the sky?', answer: 'blue', category: 'easy' },
	{ id: 3, text: 'What is the capital of France?', answer: 'Paris', category: 'easy' },
	{ id: 4, text: 'What planet do we live on?', answer: 'Earth', category: 'easy' },
	{ id: 5, text: 'What is H2O?', answer: 'water', category: 'easy' },
  ],
};
```

3. Extend the rootReducer function to store the previous question when a new question is asked.

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
	};
  } else {
	return state;
  }
}
```

**Step 2: Create the `ResultsCard` Component**

1. In your `src` directory, create a file named `ResultsCard.jsx`.

2. Inside `ResultsCard.jsx`, create the `ResultsCard` component and import `useSelector` from `react-redux`.

3. Use `useSelector` to access the `isCorrect` and `previousQuestion` state properties.

4. Add a `return` statement to display the previous question and answer, along with a message indicating whether the user's answer was correct.

5. Export the `ResultsCard` component.

```javascript
import { useSelector } from 'react-redux';

function ResultsCard() {
  const isCorrect = useSelector((state) => state.isCorrect);
  const previousQuestion = useSelector((state) => state.previousQuestion);

  return (
    <div>
      <p style={{color: isCorrect ? 'darkgreen' : 'red'}}>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
      <p>Previous Question:</p>
      <p>"{previousQuestion.text}"</p>
      <p>{isCorrect ? 'Your' : 'Correct'} Answer:</p>
      <p>"{previousQuestion.answer}"</p>
    </div>
  );
}

export default ResultsCard;
```

**Step 3: Update the App Component to Include `ResultsCard`**

1. In your `src` directory, open the `App.jsx` file.

2. Import the `ResultsCard` component.

3. Use `useSelector` to access the `previousQuestion` state.

4. Replace the paragraph that displays whether the answer was correct with the `ResultsCard` component, conditionally rendering it only when there is a previous question.

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import ResultsCard from './ResultsCard';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const isCorrect = useSelector((state) => state.isCorrect);
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
      
      {previousQuestion && <ResultsCard />}
    </div>
  );
}

export default App;
```

**To Confirm**: You should now see the previous question and answer displayed after submitting an answer.

### User Story 7: As a user, I can complete the quiz and see my results.

**Step 1: Extend the Redux Store**

1. In your `src` directory, open the `store.js` file.

2. Extend the initial state to include `totalCorrect`.

```javascript
const initialState = {
  userName: '',
  currentQuestion: null,
  previousQuestion: null,
  isCorrect: null,
  totalCorrect: 0,
  questionsAsked: [],
  questions: [
	{ id: 1, text: 'What is 2 + 2?', answer: '4', category: 'easy' },
	{ id: 2, text: 'What color is the sky?', answer: 'blue', category: 'easy' },
	{ id: 3, text: 'What is the capital of France?', answer: 'Paris', category: 'easy' },
	{ id: 4, text: 'What planet do we live on?', answer: 'Earth', category: 'easy' },
	{ id: 5, text: 'What is H2O?', answer: 'water', category: 'easy' },
  ],
};
```

3. Extend the rootReducer function to update the `totalCorrect` count when a question is answered correctly.

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
	  totalCorrect: isCorrect ? state.totalCorrect + 1 : state.totalCorrect,
	};
  } else {
	return state;
  }
}
```

**Step 2: Update the `ResultsCard` Component**

1. In your `src` directory, open the `ResultsCard.jsx` file.

2. Use `useSelector` to access the state values for `totalCorrect`, `currentQuestion`, and `questions`.

3. Add a condition to display the total results when the quiz is completed.

```javascript
import { useSelector } from 'react-redux';

function ResultsCard() {
  const isCorrect = useSelector((state) => state.isCorrect);
  const previousQuestion = useSelector((state) => state.previousQuestion);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const questions = useSelector((state) => state.questions);
  const totalCorrect = useSelector((state) => state.totalCorrect);

  return (
	<div>
	  <p style={{color: isCorrect ? 'darkgreen' : 'red'}}>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
	  <p>Previous Question:</p>
	  <p>"{previousQuestion.text}"</p>
	  <p>{isCorrect ? 'Your' : 'Correct'} Answer:</p>
	  <p>"{previousQuestion.answer}"</p>
	  {currentQuestion === null && previousQuestion !== null && (
			<h2>Quiz Completed!</h2>
	  		<p>Total Correct: {totalCorrect}</p>
			<p>Total Incorrect: {questions.length - totalCorrect}</p>
	  )}
	</div>
  );
}

export default ResultsCard;
```

**To Confirm**: You should now see the total correct and incorrect when the quiz is completed.

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
