import { expect, it, describe, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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
      attachmentsIds: ['1', '2']
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value?.question.id).toBeTruthy()
    expect(inMemoryQuestionRepository.items[0].id).toBe(result.value?.question.id)
    expect(inMemoryQuestionRepository.items[0].attachments).toHaveLength(2)
    expect(inMemoryQuestionRepository.items[0].attachments).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') })
    ])
  })
})
