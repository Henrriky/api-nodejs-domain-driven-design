import { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseInput {
  authorId: string
  questionId: string
  title: string
  content: string
}

interface EditQuestionUseCaseOutput {}

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
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
    return {}
  }
}
