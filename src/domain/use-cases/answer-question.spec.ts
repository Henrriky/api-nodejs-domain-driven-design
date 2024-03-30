import { Answer } from "../entities/Answer"
import { Instructor } from "../entities/Instructor"
import { Question } from "../entities/Question"
import { Student } from "../entities/Student"
import { Slug } from "../entities/value-objects/slug"
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
  const instructor = Instructor.create({
    name: "Belleti"
  })
  const student = Student.create({
    name: "Henrriky"
  })
  const question = Question.create({
    title: 'Title question',
    content: 'Content question',
    authorId: student.id,
    slug: new Slug('Title question'),
  })
  const answer = await answerQuestion.execute({
    instructorId: instructor.id.toString(),
    questionId: question.id.toString(),
    content: 'Content answer'
  })

  expect(answer.content).toEqual('Content answer')
})