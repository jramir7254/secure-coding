import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';
import { backend } from '@/lib/backend';
import { questionKeys } from './query-keys';

import type { GetCurrentQuestionResponse, Question, QuestionTags, QuestionAttempt } from '../types/questions';


export type AnswerChoices = QuestionTags
export type QuestionVariant = 'multiple' | 'coding' | null


export type GetQuestionResponse = {
    attemptId: number,
    questionType: QuestionVariant,
    question: Question,
    startedAt: Date
}

export type MultipleChoicePayload = {
    questionData: Question,
    attemptData: QuestionAttempt,
}


export type MultipleChoiceResponse = {
    score: number,
    questionData: Question,
    attemptData: QuestionAttempt,
    output: string
}



export function useQuestions() {
    return useQuery({
        queryKey: questionKeys.list.base(),
        queryFn: () => backend.get<Question[]>({ root: 'questions', route: '/list' }),
    })
}



export function useCurrentQuestionAttempt() {
    return useQuery({
        queryKey: questionKeys.current(),
        queryFn: () => backend.get<GetCurrentQuestionResponse>({ root: 'questions', route: '/current' }),
        placeholderData: () => ({
            attemptData: {
                id: -1,
                questionId: -1,
                teamId: -1,
                startedAt: "",
                completedAt: null,
                score: -1
            },
            questionData: {
                id: -1,
                title: "",
                type: null,
                difficulty: null,
                tags: null,
                description: "",
                explanation: "",
                codeFiles: [],
            }
        }),
    })
}




export function useCurrentQuestion() {
    const { data, isLoading } = useCurrentQuestionAttempt()

    if (isLoading || !data) return

    return data.questionData
}


export function useCurrentAttempt() {
    const { data, isLoading } = useCurrentQuestionAttempt()

    if (isLoading || !data) return

    return data.attemptData
}

export function useIsAttemptComplete() {
    const attempt = useCurrentAttempt()

    if (!attempt) return false

    return !!attempt.completedAt
}


export function useQuestionAttempt() {
    const attemptData = useCurrentAttempt()
    const questionData = useCurrentQuestion()
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (submissionData: any) =>
            backend.post<MultipleChoiceResponse>({
                root: 'questions',
                route: '/attempt',
                payload: {
                    attemptData,
                    questionData,
                    submissionData,
                },
            }),

        onSuccess: (data) => {
            // Update the cache for the "current question"
            toast.success(`Scored ${data.score} on this question`)
            qc.setQueryData(
                questionKeys.current(),
                (old: GetCurrentQuestionResponse) => {
                    if (!old) return old; // no cache yet
                    return {
                        ...old,
                        attemptData: {
                            ...old.attemptData,
                            completedAt: new Date()
                        }
                    };
                }
            );
        },
    });
}


export function useMultipleChoiceAttempt(payload: any) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (submittedAnswers: AnswerChoices[]) =>
            backend.post<MultipleChoiceResponse>({
                root: 'questions',
                route: '/attempt',
                payload: {
                    ...payload,
                    submittedAnswers,
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
                        attemptData: {
                            ...old.attemptData,
                            completedAt: new Date()
                        }
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





