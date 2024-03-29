import { Answer } from "../entities/Answer"
import { Instructor } from "../entities/Instructor"
import { Question } from "../entities/Question"
import { Student } from "../entities/Student"
import { AnswersRepository } from "../repositories/answers-repository"
import { AnswerQuestionUseCase } from "./answer-question"
import { expect, test } from 'vitest'

let fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return
  }
}
test('create an answer', async () => {
  
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)
  const instructor = new Instructor("Belleti")
  const student = new Student("Henrriky")
  const question = new Question({
    title: 'Title question',
    content: 'Content question',
    authorId: student.id
  })
  const answer = await answerQuestion.execute({
    instructorId: instructor.id,
    questionId: question.id,
    content: 'Content answer'
  })

  expect(answer.content).toEqual('Content answer')
})