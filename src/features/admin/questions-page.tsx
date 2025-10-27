import { useQuestions } from "../game/hooks/use-question";


export default function QuestionsPage() {
    const { data: questions } = useQuestions();
    return (
        <div className=''>
            {questions && questions.map(q =>
                <div>
                    <p>{q.id}</p>
                </div>
            )}
        </div>
    )
}
