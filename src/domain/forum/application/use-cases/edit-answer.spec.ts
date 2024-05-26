import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let usecase: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    usecase = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await usecase.execute({
      answerId: newAnswer.id.toValue(),
      authorId: newAnswer.authorId.toValue(),
      content: "New answer content"
    })

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: "New answer content"
    })
  })

  it('should be return an error if the answer does not exist', async () => {
    await expect(() =>
      usecase.execute({
        authorId: 'author-id',
        answerId: 'non-existent-id',
        content: "New answer content"
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be return an error if the author that is trying to edit the answer is not the author of the answer', async () => {
    const answerId = new UniqueEntityID('answer-1')

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      answerId,
    )

    await inMemoryAnswerRepository.create(newAnswer)

    async function executeUseCase() {
      try {
        await usecase.execute({
          authorId: 'another-author-id',
          answerId: answerId.toString(),
          content: "New answer content"
        })
      } catch (error) {
        return error
      }
    }

    const error = (await executeUseCase()) as Error
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('You are not the author of this answer')
  })
})
