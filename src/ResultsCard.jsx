import { useSelector } from "react-redux";

function ResultsCard() {
    const isCorrect = useSelector((state) => state.isCorrect);
    const previousQuestion = useSelector((state) => state.previousQuestion);
    const totalCorrect = useSelector((state) => state.totalCorrect);
    const currentQuestion = useSelector((state) => state.currentQuestion);
    const questions = useSelector((state) => state.questions);

    return (
        <div>
            <p style={{color: isCorrect ? 'darkgreen' : 'red'}}>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
            <p>Previous Question:</p>
            <p>"{previousQuestion.text}"</p>
            <p>{isCorrect ? 'Your' : 'Correct'} Answer:</p>
            <p>"{previousQuestion.answer}"</p>
            {currentQuestion === null && previousQuestion !== null && (
                <div>
                    <h2>Quiz Completed!</h2>
                    <p>Total Correct: {totalCorrect}</p>
                    <p>Total Incorrect: {questions.length - totalCorrect}</p>
                </div>
            )}
        </div>
    )
}

export default ResultsCard;