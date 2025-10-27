import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';
import { backend } from '@/lib/backend';

export const questionKeys = {
    root: ['questions'] as const,
    list: {
        base: () => [...questionKeys.root, "list"] as const,
        attempts: {
            team: (teamId: string) => [...questionKeys.list.base(), "attempts", "teams", teamId] as const,
        }
    },
    current: () => [...questionKeys.root, "current"] as const,
    previous: () => [...questionKeys.root, "previous"] as const,

    detail: {
        root: () => [...questionKeys.root, "detail"] as const,
        read: (questionId: string) => [...questionKeys.root, "detail", questionId] as const,
    },
};


export type AnswerChoices = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;
export type QuestionVariant = 'multiple' | 'coding' | null
export type Question = { id: number, code: string, explanation: string, editableRanges?: number[], answer?: string, expectedOutput?: string }


export type GetQuestionResponse = {
    attemptId: number,
    questionType: QuestionVariant,
    question: Question,
    startedAt: Date
}

export type MultipleChoicePayload = {
    questionId: number,
    attemptId: number,
    questionType: QuestionVariant
}


export type MultipleChoiceResponse = {
    score: number,
    attemptId: number,
    questionType: QuestionVariant
}



export function useQuestions() {
    return useQuery({
        queryKey: questionKeys.list.base(),
        queryFn: () => backend.get<Question[]>({ root: 'questions', route: '/list' }),
    })
}



export function useCurrentQuestion() {
    return useQuery({
        queryKey: questionKeys.current(),
        queryFn: () => backend.get<GetQuestionResponse>({ root: 'questions', route: '/current' }),
    })
}


export function useMultipleChoiceAttempt(payload: MultipleChoicePayload) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (selectedAnswer: AnswerChoices) =>
            backend.post<MultipleChoiceResponse>({
                root: 'questions',
                route: '/attempt',
                payload: {
                    ...payload,
                    selectedAnswer,
                },
            }),

        onSuccess: (data) => {
            // Update the cache for the "current question"
            toast.success(`Scored ${data.score} on this question`)
            qc.setQueryData<MultipleChoiceResponse>(
                questionKeys.current(),
                (old) => {
                    if (!old) return old; // no cache yet
                    return {
                        ...old,
                        attemptId: data.attemptId,
                        questionType: data.questionType,
                    };
                }
            );
        },
    });
}



export function useCodingAttempt(payload: MultipleChoicePayload) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (submittedCode: string) =>
            backend.post<MultipleChoiceResponse>({
                root: 'questions',
                route: '/attempt',
                payload: {
                    ...payload,
                    submittedCode,
                },
            }),

        onSuccess: (data) => {
            // Update the cache for the "current question"
            toast.success(`Scored ${data?.score || -1} on this question`)
            qc.setQueryData<MultipleChoiceResponse>(
                questionKeys.current(),
                (old) => {
                    if (!old) return old; // no cache yet
                    return {
                        ...data
                    };
                }
            );
        },
    });
}



