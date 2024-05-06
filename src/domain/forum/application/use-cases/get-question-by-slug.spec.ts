import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionRepository.create(newQuestion)

    const { question } = await usecase.execute({
      slug: newQuestion.slug.value,
    })

    expect(question.id).toBeTruthy()
    expect(question.title).toEqual(newQuestion.title)
  })

  it('should be return an error if the question does not exist', async () => {
    await expect(() =>
      usecase.execute({
        slug: 'non-existent-slug',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
