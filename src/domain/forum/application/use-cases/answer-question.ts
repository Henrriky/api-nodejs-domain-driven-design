import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/Answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseInput {
  instructorId: string
  questionId: string
  content: string
}
interface AnswerQuestionUseCaseOuput {
  answer: Answer
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    questionId,
    instructorId,
    content,
  }: AnswerQuestionUseCaseInput): Promise<AnswerQuestionUseCaseOuput> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.answerRepository.create(answer)

    return { answer }
  }
}