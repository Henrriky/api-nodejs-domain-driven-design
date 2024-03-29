import { Answer } from "../entities/Answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseInput {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {

  constructor(
    private answerRepository: AnswersRepository,
  ) {}
  
  async execute({ questionId, instructorId, content }: AnswerQuestionUseCaseInput) {
    const answer = new Answer({
      content,
      authorId: instructorId,
      questionId,
    })

    await this.answerRepository.create(answer)

    return answer
  }
}