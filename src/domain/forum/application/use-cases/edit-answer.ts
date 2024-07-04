import { Either, failure, success } from '@/core/either'
import { Answer } from '../../enterprise/entities/Answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditAnswerUseCaseInput {
  authorId: string
  answerId: string
  content: string
}

type EditAnswerUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError('Answer not found'))
    }

    if (answer.authorId.toString() !== authorId) {
      return failure(
        new NotAllowedError('You are not the author of this answer'),
      )
    }

    answer.content = content

    await this.answersRepository.save(answer)
    return success({ answer })
  }
}
