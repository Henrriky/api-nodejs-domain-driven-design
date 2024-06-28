import { AnswerComment } from "../../enterprise/entities/Answer-Comment";


export interface AnswerCommentsRepository {
  create(AnswerComment: AnswerComment): Promise<void>
}