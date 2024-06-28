import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerCase } from './comment-on-answer'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let usecase: CommentOnAnswerCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    usecase = new CommentOnAnswerCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-1'),
    )
    await inMemoryAnswerRepository.create(newAnswer)

    await usecase.execute({
      authorId: 'author-id-comment',
      answerId: newAnswer.id.toString(),
      content: 'Comment content'
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Comment content')
    expect(inMemoryAnswerCommentsRepository.items[0]).toMatchObject({
      content: 'Comment content'
    })
  })

  it('should be return an error if the answer does not exist', async () => {

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-1'),
    )
    await inMemoryAnswerRepository.create(newAnswer)

    await usecase.execute({
      authorId: 'author-id-comment',
      answerId: newAnswer.id.toString(),
      content: 'Comment content'
    })

    await expect(() =>
      usecase.execute({
        authorId: 'author-id-comment',
        answerId: 'any-answer-id',
        content: 'Comment content'
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
