

export type AnswerChoices = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;
export type QuestionTags = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;
export type QuestionTypes = 'mcq' | 'break' | 'fix' | 'exploit' | 'coding' | null
export type Difficulties = 'easy' | 'medium' | 'hard' | null

type RestrictedRanges = [number, number, number, number] | [number, number]


export interface CodeFile {
    id: number
    questionId: number
    name: string,
    language: string,
    value: string,
    displayOrder: number
    editableRanges: RestrictedRanges[] | []
}


export interface Question {
    id: number
    title: string
    type: QuestionTypes
    difficulty: Difficulties
    tags: QuestionTags[] | null
    description?: string
    explanation?: string
    codeFiles: CodeFile[]
}


export interface QuestionAttempt {
    id: number
    questionId: number
    teamId: number
    startedAt: string
    completedAt: string | null
    score: number
}


export type GetCurrentQuestionResponse = {
    attemptData: QuestionAttempt,
    questionData: Question,
}

