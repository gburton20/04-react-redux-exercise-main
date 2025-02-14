import { useDispatch, useSelector } from "react-redux"

function App() {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.username);

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
