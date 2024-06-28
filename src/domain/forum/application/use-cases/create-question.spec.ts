import { expect, it, describe, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to create a question', async () => {
    const result = await usecase.execute({
      authorId: '1',
      title: 'New question',
      content: 'Content question',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value?.question.id).toBeTruthy()
    expect(inMemoryQuestionRepository.items[0].id).toBe(result.value?.question.id)
  })
})
