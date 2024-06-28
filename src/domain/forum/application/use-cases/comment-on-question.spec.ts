import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionCase } from './comment-on-question'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: CommentOnQuestionCase

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new CommentOnQuestionCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)

    await usecase.execute({
      authorId: 'author-id-comment',
      questionId: newQuestion.id.toString(),
      content: 'Comment content'
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('Comment content')
    expect(inMemoryQuestionCommentsRepository.items[0]).toMatchObject({
      content: 'Comment content'
    })
  })

  it('should be return an error if the question does not exist', async () => {

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionRepository.create(newQuestion)

    await usecase.execute({
      authorId: 'author-id-comment',
      questionId: newQuestion.id.toString(),
      content: 'Comment content'
    })

    await expect(() =>
      usecase.execute({
        authorId: 'author-id-comment',
        questionId: 'any-question-id',
        content: 'Comment content'
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
