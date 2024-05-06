import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await usecase.execute({
      authorId: 'author-id',
      questionId: 'question-1',
    })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
  })

  it('should be return an error if the question does not exist', async () => {
    await expect(() =>
      usecase.execute({
        authorId: 'author-id',
        questionId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be return an error if the author that is trying to delete the question is not the author of the question', async () => {
    const questionId = new UniqueEntityID('question-1')

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      questionId,
    )

    await inMemoryQuestionRepository.create(newQuestion)

    async function executeUseCase() {
      try {
        await usecase.execute({
          authorId: 'another-author-id',
          questionId: questionId.toString(),
        })
      } catch (error) {
        return error
      }
    }

    const error = (await executeUseCase()) as Error
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('You are not the author of this question')
  })
})
