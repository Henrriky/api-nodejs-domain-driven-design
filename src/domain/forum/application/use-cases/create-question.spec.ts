import { Question } from '@/domain/forum/enterprise/entities/Question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { expect, test } from 'vitest'
import { CreateQuestionUseCase } from './create-question'

const fakeQuestionsRepository: QuestionsRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (question: Question) => {},
}
test('create an answer', async () => {
  const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository)
  const { question } = await createQuestion.execute({
    authorId: '1',
    title: 'New question',
    content: 'Content question',
  })

  expect(question.id).toBeTruthy()
})
