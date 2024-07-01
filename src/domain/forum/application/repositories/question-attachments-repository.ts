import { QuestionAttachment } from '../../enterprise/entities/Question-Attachment'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>
}
