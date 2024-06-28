import { QuestionComment } from "../../enterprise/entities/Question-Comment";


export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
}