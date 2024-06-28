import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await usecase.execute({
      questionId: newQuestion.id.toValue(),
      authorId: newQuestion.authorId.toValue(),
      title: "New question",
      content: "New question content"
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: "New question",
      content: "New question content"
    })
  })

  it('should be return an error if the question does not exist', async () => {
    const result = await usecase.execute({
      authorId: 'author-id',
      questionId: 'non-existent-id',
      title: "New question",
      content: "New question content"
    })


    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be return an error if the author that is trying to edit the question is not the author of the question', async () => {
    const questionId = new UniqueEntityID('question-1')

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      questionId,
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await usecase.execute({
      authorId: 'another-author-id',
      questionId: questionId.toString(),
      title: "New question",
      content: "New question content"
    })


    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
