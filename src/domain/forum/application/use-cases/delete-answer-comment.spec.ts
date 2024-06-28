import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let usecase: DeleteAnswerCommentUseCase

describe('Delete AnswerComment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
    usecase = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-comment-1'),
    )

    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    await usecase.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId: newAnswerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should be return an error if the answer comment does not exist', async () => {
    await expect(() =>
      usecase.execute({
        authorId: 'author-id',
        answerCommentId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be return an error if the author that is trying to delete the answer comment is not the author of the answer comment', async () => {
    
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-comment-1'),
    )
    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    async function executeUseCase() {
      try {
        await usecase.execute({
          authorId: 'another-author-id',
          answerCommentId: newAnswerComment.id.toString(),
        })
      } catch (error) {
        return error
      }
    }

    const error = (await executeUseCase()) as Error
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('You are not the author of this comment')
  })
})
