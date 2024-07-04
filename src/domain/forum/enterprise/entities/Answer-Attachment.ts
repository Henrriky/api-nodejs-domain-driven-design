import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerAttachmentProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  public get answerId() {
    return this.props.answerId
  }

  public get attachmentId() {
    return this.props.answerId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachment(props, id)

    return answerAttachment
  }
}
