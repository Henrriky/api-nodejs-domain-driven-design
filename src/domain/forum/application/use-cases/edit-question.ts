import { Either, failure, success } from '@/core/either'
import { Question } from '../../enterprise/entities/Question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditQuestionUseCaseInput {
  authorId: string
  questionId: string
  title: string
  content: string
}

type EditQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError, 
  {
  question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    title,
    content
  }: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError('Question not found'))
    }

    if (question.authorId.toString() !== authorId) {
      return failure(new NotAllowedError('You are not the author of this question'))
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
    return success({ question })
  }
}
