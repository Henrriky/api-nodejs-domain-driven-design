import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseInput {
  authorId: string
  answerCommentId: string
}

interface DeleteAnswerCommentUseCaseOutput {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseInput): Promise<DeleteAnswerCommentUseCaseOutput> {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer Comment not found')
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this comment')
    }

    await this.answerCommentsRepository.delete(answerComment)
    return {}
  }
}
