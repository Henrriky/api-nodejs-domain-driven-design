import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let usecase: DeleteQuestionCommentUseCase

describe('Delete QuestionComment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
    usecase = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-comment-1'),
    )

    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    await usecase.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  it('should be return an error if the question comment does not exist', async () => {
    await expect(() =>
      usecase.execute({
        authorId: 'author-id',
        questionCommentId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be return an error if the author that is trying to delete the question comment is not the author of the question comment', async () => {
    
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-comment-1'),
    )
    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    async function executeUseCase() {
      try {
        await usecase.execute({
          authorId: 'another-author-id',
          questionCommentId: newQuestionComment.id.toString(),
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
