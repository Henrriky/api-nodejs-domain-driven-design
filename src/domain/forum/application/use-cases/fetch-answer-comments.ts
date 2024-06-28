import { AnswerComment } from '../../enterprise/entities/Answer-Comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseInput {
  answerId: string
  page: number
}

interface FetchAnswerCommentsUseCaseOutput {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId
  }: FetchAnswerCommentsUseCaseInput): Promise<FetchAnswerCommentsUseCaseOutput> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page
    })

    return {
      answerComments,
    }
  }
}
