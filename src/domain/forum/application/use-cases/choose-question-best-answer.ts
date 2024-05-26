import { Question } from '../../enterprise/entities/Question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseInput {
  authorId: string
  answerId: string
}

interface ChooseQuestionBestAnswerUseCaseOutput {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answerRepository: AnswersRepository
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {

    const answer = await this.answerRepository.findById(answerId)
    if (!answer) {
      throw new Error('Answer not found')
    }


    const question = await this.questionsRepository.findById(answer.questionId.toValue())
    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question')
    }

    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    return {
      question
    }
  }
}
