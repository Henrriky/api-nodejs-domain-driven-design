import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseInput {
  authorId: string
  questionId: string
}

interface DeleteQuestionUseCaseOutput {}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question')
    }

    await this.questionsRepository.delete(question)
    return {}
  }
}
