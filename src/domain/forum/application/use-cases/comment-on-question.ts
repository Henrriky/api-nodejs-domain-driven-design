import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionComment } from '../../enterprise/entities/Question-Comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CommentOnQuestionCaseInput {
  questionId: string
  authorId: string
  content: string
}

interface CommentOnQuestionCaseOutput {
  questionComment: QuestionComment
}

export class CommentOnQuestionCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionCaseInput): Promise<CommentOnQuestionCaseOutput> {

    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error("Question not found.")
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content
    })

    await this.questionCommentsRepository.create(questionComment)
    return {
      questionComment,
    }
  }
}
