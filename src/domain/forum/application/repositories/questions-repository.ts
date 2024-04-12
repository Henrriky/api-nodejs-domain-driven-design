import { Question } from '../../enterprise/entities/Question'

export interface QuestionsRepository {
  create(question: Question): Promise<void>
}
