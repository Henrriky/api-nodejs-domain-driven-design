import { Answer } from '@/domain/forum/enterprise/entities/Answer'

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
}
