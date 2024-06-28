import { Instructor } from '@/domain/forum/enterprise/entities/Instructor'
import { Question } from '@/domain/forum/enterprise/entities/Question'
import { Student } from '@/domain/forum/enterprise/entities/Student'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AnswerQuestionUseCase } from './answer-question'
import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let usecase: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    usecase = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to answer a question', async () => {
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
      slug: Slug.create('title-question'),
    })
    const result = await usecase.execute({
      instructorId: instructor.id.toString(),
      questionId: question.id.toString(),
      content: 'Content answer',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value?.answer.content).toEqual('Content answer')
    expect(inMemoryAnswersRepository.items[0].id).toBe(result.value?.answer.id)
  })
})
