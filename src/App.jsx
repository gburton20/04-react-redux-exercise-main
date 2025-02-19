import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import ResultsCard from './ResultsCard';

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.userName);
  const currentQuestion = useSelector((state) => state.currentQuestion);
  const previousQuestion = useSelector((state) => state.previousQuestion);
  const isCorrect = useSelector((state) => state.isCorrect);
  const [answer, setAnswer] = useState('');

  function handleNameSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SET_USER_NAME', payload: e.target.name.value });
    dispatch({ type:  'NEXT_QUESTION' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch ({ type: 'SUBMIT_ANSWER', payload: answer });
    dispatch ({ type: 'NEXT_QUESTION' });
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
                  type='text'
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button type='submit'>Submit</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* {isCorrect !== null && (
        <p>{isCorrect ? 'Correct!' : 'Incorrect!' }</p>
      )} */}
      {previousQuestion && <ResultsCard />}

    </div>
  );
}

export default App;