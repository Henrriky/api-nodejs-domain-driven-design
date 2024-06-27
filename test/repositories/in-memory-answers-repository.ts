import { PaginationParams } from '@/core/repositories/paginations-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/Answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async findById(id: string) {

    const answer = this.items.find(item => item.id.toString() === id)

    if (!answer) return null

    return answer

  }

  async findManyByTopicId(questionId: string, params: PaginationParams): Promise<Answer[]> {

    params.page = Math.max(1, params.page);
    const limit = 10;
    const previousOffset = (params.page - 1) * limit
    const finalOffset = (params.page * limit)

    const answers = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice(previousOffset, finalOffset)

    return answers
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex(item => item.id === answer.id)

    this.items.splice(itemIndex, 1)
  }
}
