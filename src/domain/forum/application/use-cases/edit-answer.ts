import { Answer } from '../../enterprise/entities/Answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseInput {
  authorId: string
  answerId: string
  content: string
}

interface EditAnswerUseCaseOutput {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this answer')
    }

    answer.content = content


    await this.answersRepository.save(answer)
    return {
      answer
    }
  }
}
