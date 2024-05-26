import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseInput {
  authorId: string
  answerId: string
}

interface DeleteAnswerUseCaseOutput {}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this answer')
    }

    await this.answersRepository.delete(answer)
    return {}
  }
}
