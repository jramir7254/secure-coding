

export type AnswerChoices = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;
export type QuestionTags = 'runtime' | 'logic' | 'compile' | 'vulnerability' | null;
export type QuestionTypes = 'mcq' | 'break' | 'fix' | 'exploit' | 'coding' | null
export type Difficulties = 'easy' | 'medium' | 'hard'


export interface CodeFile {
    id: string
    questionId: string
    name: string,
    language: string,
    value: string,
    displayOrder: number
    editableRanges: number[] | ['readonly']
}


export interface Question {
    id: number
    title: string
    type: QuestionTypes
    difficulty: number[]
    tags: QuestionTags[]
    description?: string
    explanation?: string
    codeFiles: CodeFile[]
}


export interface QuestionAttempt {
    id: number
    questionId: string
    teamId: string
    startedAt: string
    completedAt: string
    score: number
}


export type GetCurrentQuestionResponse = {
    attemptData: QuestionAttempt,
    questionData: Question,
}

