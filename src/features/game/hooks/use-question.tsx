import React, { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { socket } from '@/lib/socket';
import { useApi } from '@/hooks/use-api';
import { toast } from 'sonner';

export const questionKeys = {
    all: ['question'] as const,
    current: ["question", "current"] as const,
    previous: ["question", "previous"] as const,
};


export type AnswerChoices = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;
export type QuestionVariant = 'multiple' | 'coding' | null
export type Question = { id: number, code: string, explanation: string, editableRanges?: number[] }


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



export function useCurrentQuestion() {
    const { call } = useApi('questions')
    return useQuery({
        queryKey: questionKeys.current,
        queryFn: () => call<GetQuestionResponse>('get', '/current'),
    })
}


export function useMultipleChoiceAttempt(payload: MultipleChoicePayload) {
    const qc = useQueryClient();
    const { call } = useApi('questions');

    return useMutation({
        mutationFn: (selectedAnswer: AnswerChoices) =>
            call<MultipleChoiceResponse>('post', '/attempt', {
                ...payload,
                selectedAnswer,
            }),

        onSuccess: (data) => {
            // Update the cache for the "current question"
            toast.success(`Scored ${data.score} on this question`)
            qc.setQueryData<MultipleChoiceResponse>(
                questionKeys.current,
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
    const { call } = useApi('questions');

    return useMutation({
        mutationFn: (submittedCode: string) =>
            call<MultipleChoiceResponse>('post', '/attempt', {
                ...payload,
                submittedCode,
            }),

        onSuccess: (data) => {
            // Update the cache for the "current question"
            toast.success(`Scored ${data?.score || -1} on this question`)
            qc.setQueryData<MultipleChoiceResponse>(
                questionKeys.current,
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



