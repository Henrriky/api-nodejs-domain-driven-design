import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let usecase: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    usecase = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await usecase.execute({
      authorId: 'author-id',
      answerId: 'answer-1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryAnswerRepository.items).toHaveLength(0)
  })

  it('should be return an error if the answer does not exist', async () => {
    const result = await usecase.execute({
      authorId: 'author-id',
      answerId: 'non-existent-id',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be return an error if the author that is trying to delete the answer is not the author of the answer', async () => {
    const answerId = new UniqueEntityID('answer-1')

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      answerId,
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await usecase.execute({
      authorId: 'another-author-id',
      answerId: answerId.toString(),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
