import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/Answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, success } from '@/core/either'

interface AnswerQuestionUseCaseInput {
  instructorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseOuput = Either<null, { answer: Answer }>

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

    return success({ answer })
  }
}
