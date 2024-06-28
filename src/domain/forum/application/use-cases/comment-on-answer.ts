import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerComment } from '../../enterprise/entities/Answer-Comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CommentOnAnswerCaseInput {
  answerId: string
  authorId: string
  content: string
}

interface CommentOnAnswerCaseOutput {
  answerComment: AnswerComment
}

export class CommentOnAnswerCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerCaseInput): Promise<CommentOnAnswerCaseOutput> {

    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error("Answer not found.")
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content
    })

    await this.answerCommentsRepository.create(answerComment)
    return {
      answerComment,
    }
  }
}
