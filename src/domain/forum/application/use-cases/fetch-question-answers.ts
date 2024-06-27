import { Answer } from '../../enterprise/entities/Answer'
import { Question } from '../../enterprise/entities/Question'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseInput {
  questionId: string
  page: number
}

interface FetchQuestionAnswersUseCaseOutput {
  answers: Answer[]
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId
  }: FetchQuestionAnswersUseCaseInput): Promise<FetchQuestionAnswersUseCaseOutput> {
    const answers = await this.answersRepository.findManyByTopicId(questionId, {
      page
    })

    return {
      answers,
    }
  }
}
