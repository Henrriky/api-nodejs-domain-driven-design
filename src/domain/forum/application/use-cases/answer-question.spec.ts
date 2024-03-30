import { Answer } from '@/domain/forum/enterprise/entities/Answer'
import { Instructor } from '@/domain/forum/enterprise/entities/Instructor'
import { Question } from '@/domain/forum/enterprise/entities/Question'
import { Student } from '@/domain/forum/enterprise/entities/Student'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { expect, test } from 'vitest'

const fakeAnswersRepository: AnswersRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (answer: Answer) => {},
}
test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)
  const instructor = Instructor.create({
    name: 'Belleti',
  })
  const student = Student.create({
    name: 'Henrriky',
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
    content: 'Content answer',
  })

  expect(answer.content).toEqual('Content answer')
})
