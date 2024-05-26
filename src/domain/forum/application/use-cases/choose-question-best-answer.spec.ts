import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to choose question best answer', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-1'),
    )

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
        questionId: newQuestion.id
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)
    await inMemoryQuestionRepository.create(newQuestion)

    await usecase.execute({
      answerId: newAnswer.id.toValue(),
      authorId: newAnswer.authorId.toValue(),
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      bestAnswerId: newAnswer.id
    })
  })

  it('should be return an error if the answer does not exist', async () => {

    await expect(() =>
      usecase.execute({
        authorId: 'author-id',
        answerId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be return an error if the question does not exist', async () => {

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await expect(() =>
      usecase.execute({
        authorId: 'author-id',
        answerId: newAnswer.id.toValue(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be return an error if the author that is trying to choose question best answer is not the author of the question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id')
      },
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const answerId = new UniqueEntityID('answer-1')

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
        questionId: newQuestion.id
      },
      answerId,
    )

    await inMemoryAnswerRepository.create(newAnswer)

    async function executeUseCase() {
      try {
        await usecase.execute({
          authorId: 'another-author-id',
          answerId: answerId.toString(),
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
