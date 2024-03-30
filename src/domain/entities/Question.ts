import { randomUUID } from "crypto"
import { Slug } from "./value-objects/slug"

interface QuestionProps {
  title: string
  content: string
  authorId: string
  slug: Slug
}

export class Question {

  public id: string
  public title: string
  public content: string
  public authorId: string
  public slug: Slug

  constructor (props: QuestionProps, id?: string) {
    this.title = props.title
    this.content = props.content
    this.authorId = props.authorId
    this.slug = props.slug
    this.id = id ?? randomUUID()
  }
}