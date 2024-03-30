# Introdução ao DDD

- DDD é uma forma da gente manter uma comunicação de forma clara e padronizada entre todas as partes envolvidas no desenvolvimento de software.
- Design Dirigido à Domínio
  - Design é como nós vamos converter o problema do cliente em algo tangível e que resolve o problema em questão do domínio do cliente, ou seja, é gerar valor para o cliente através do software.
  - Domínio é uma área de entendimento, onde todas as partes envolvidas na construção do software devem possuir um entendimento comum.
  - A primeira etapa de um software é compreender o problema do cliente (domain experts).
  - `Domain experts`: Pessoas que entendem a fundo sobre o contexto/área de negócio do problema que o cliente quer resolver.
    - As pessoas que estão no dia-a-dia lidando com as situações do problema são os domain experts.
    - isso quer dizer que devemos ter uma comunicação constante com o cliente e sseus domain experts para extrair ao máximo informações sobre o domínio do problema.
  - `Linguagem Ubígua`: Essas conversas com os Domain Experts vão gerar uma linguagem ubígua, que são termos comuns entre as partes envolvidas no projeto para que todos tenham uma equidade de entendimento.
    - Exemplo: Cliente fala "Pedido", desenvolvedor fala "Pedido", DBA fala "Pedido", todos estão falando a mesma coisa.
    - É uma linguagem universal aonde todos podem conversas por igual.
    - É uma característica que deve ser alcançada partindo de todas as partes
- Alguns termos comuns no DDD:
  - Agreggates
  - Value Object
  - Domain Events
  - Domains
  - Subdomains
  - Bounded contexts
  - Entities
  - Use cases

## Entidades (Domains Models) e casos de uso

- Pensar no Software como algo totalmente desconectado de camadas externas
- Na Clean Architecture, o software é dividido em camadas, onde a camada mais interna é a mais importante, pois é a camada que contém as regras de negócio. Isso quer dizer que o que importa é o domínio do software e não as suas camadas externas, pois isso pode ser substituido. A ideia é permitir que o domínio do software seja independente de qualquer outra coisa e permita que a gente possa simplesmente mover ele para outro framework sem dores.
- `npm init -y`
- `npm i typescript @types/node`
- `npx tsc --init`
  - `"target": "es2020"`, 
- Criação da pasta `domain`, onde vai existir todo o código do domínio do software (camada mais interna) e que esteja desconexo de camadas externas.

### Definindo Entidades

- Criação da pasta `/domain/entities`
- Entidades é tudo que vai ser mantido pelo nosso usuário.
- Essas entidades são extraidas através de uma sequência de entrevistas
  - Exemplo: Tenho muita dificuldade em saber as `dúvidas` dos `alunos` e eu me perco em quais dúvidas já foram 
  - Dúvidas, Instrutor e Alunos são entidades, responder dúvidas é um use-case
  - DICA: VERBO (USE-CASE) ENTIDADES (SUBSTANTIVOS)
- Cada convers com os Domains Experts são extremamente importantes para que haja uma extração correta das entidades e use-cases.
- Como o que mais importa é a camada de `domínio`, nós devemos sempre iniciar o código por essa camada.
  - Criar a entidade `Instructor`
  - Criar a entidade `Question`

### Definindo Use cases 

- Criação da pasta `/domain/use-cases`
- No exemplo das entidades o use-case é `responder dúvidas`
- Os uses-cases de um software na maioria das vezes são os verbos que o usuário vai executar no software. Além disso, ele representa funcionalidades ou requisitos que o cliente possui como uma necessidade para o seu software ou para alcançar essa necessidade.
- Para Martin Flower: Use-cases é uma interação ente o usuário e um sistema de computador, são técnicas utilizadas na elicitação de requisitos.
- Conseguimos extrair esses use-cases através de entrevistas e de uma técnica muito utilizada chamada de `histórias de usuário`

## Primeiro case de uso

- O domínio da aplicação é um processo iterativo que cresce conforme a comunicação entre todas as partes vai sendo aperfeiçoada, ou seja, a cada conversa com os domain experts, melhorias nos domains models e nos use-cases podem surgir, e essa é a ideia do DDD. Permitir que o software acompanhe a dinamicidade do negócio do cliente.
- A primeiro momento não devemos tentar construir entidades e casos de uso perfeitos. A ideia é construir algo que ilustre minimamente o domínio do cliente e que possa ser melhorado com o tempo.
- Classes a serem definidas:
  ```ts
  export class Instructor {
    public id: string
    public name: string

    constructor (name: string, id?: string) {
      this.name = name
      this.id = id ?? randomUUID()
    }
  }
  export class Question {
    public id: string
    public title: string
    public content: string

    constructor (title: string, content: string, id?: string) {
      this.title = title
      this.content = content
           this.id = id ?? randomUUID()
    }
  }
  export class Student {
    public id: string
    public name: string

    constructor (name: string, id?: string) {
      this.name = name
      this.id = id ?? randomUUID()
    }
  }
  interface AnswerQuestionUseCaseInput {
    instructorId: string
    questionId: string
    content: string
  }

  class AnswerQuestionUseCase {
    execute({ questionId, instructorId, content }: AnswerQuestionUseCaseInput) {
      const answer = new Answer(content)

      return answer
    }
  }
  ```
- Com esse caso de uso, nasce uma nova entidade, que é `Answer`. Devemos esquecer a ideia de tabelas e focar no domínio da aplicação, pois em um cenário real, por exemplo, Answer e Question poderiam ser armazenadas na mesma tabela.
- Agora podemos escrever um teste para a nossa aplicação
  - `npm install vitest -D`
  ```ts
    import { Instructor } from "../entities/Instructor"
    import { Question } from "../entities/Question"
    import { AnswerQuestionUseCase } from "./answer-question"
    import { expect, test } from 'vitest'


    test('create an answer', () => {
      
      const answerQuestion = new AnswerQuestionUseCase()
      const instructor = new Instructor("Henrriky")
      const question = new Question('Title question', 'Content question')
      const answer = answerQuestion.execute({
        instructorId: instructor.id,
        questionId: question.id,
        content: 'Content answer'
      })

      expect(answer.content).toEqual('Content answer')
    })
  ```

## Mapeando relacionamentos

- Agora que criamos um caso de uso base e algumas entidades é necessário demonstrar o relacionamento dessas entidades no nosso domínio, pois na realidade as entidades se relacionam uma com as outras. No entanto, não devemos ter a mentalidades de banco de dados e sim a de relacionamentos.
  - Uma `Question` sempre vai ser feita por apenas um `Instructor` ou `Student`
  - Um `Instrutor` pode responder várias `Answer`
  - Uma `Question` pode ter várias `Answer`
  - Um `Student` pode fazer várias `Question`
  - uma `Question` pode ser feita por vários `Student`.
- O caso de uso `Answer a question` pode ser feito pelo `Instructor` e pelo `Student`, ou seja, devemos ou não reutilizar o caso de uso para ambos?
  - A resposta para isso varia muito, no entanto, nesse caso específico, a resposta é não, pois caso uma regra de negócio seja aplicada somente para um Instructor ou Student nós teríamos que ficar inflando nosso Use case, o que causaria um excesso de responsabilidades dele, infringindo o Single Responsability Principle do SOLID.
- Outra característica do DDD é deixar o mais explícito possível o que está acontecendo no domínio da aplicação, ou seja, não adianta aplicarmos o DRY (Don't Repeat Yourself) e acabar deixando o código menos legível e prejudicando a visibilidade do nosso domínio e também das regras de negócio. Tal aplicabilidade prejudicaria a manutenção do código e a comunicação entre as partes envolvidas no projeto.

## Dependências externas 

- Após a criação de entidades e casos de uso, é normal identificar pontos de conexão com `camadas externas` da aplicação de domínio, como a camada de persistência.
- Para isso a gente possui diversas abordagens/padrões para a camada de persistência, como os: `Repositories`, `Active Record`, `Data Mapper` entre outros.
- Criação da pasta `/domain/repositories`
  - O `Repository` é um padrão de projeto que permite a separação da lógica de negócio da lógica de persistência, ou seja, ele é responsável por fazer a comunicação com a camada de persistência e retornar os dados para a camada de domínio.
  ```ts
  import { Answer } from "../entities/Answer";

  export interface AnswersRepository {
    create(answer: Answer): Promise<void>
  }
  //Agora nosso use-case se altera recebendo repository para persistir no banco de dados após a validação na camada de domínio
  export class AnswerQuestionUseCase {

  constructor(
    private answerRepository: AnswersRepository,
  ) {}
  
  async execute({ questionId, instructorId, content }: AnswerQuestionUseCaseInput) {
    const answer = new Answer({
      content,
      authorId: instructorId,
      questionId,
    })

    await this.answerRepository.create(answer)

    return answer
  }
  }
  //Reescrita do teste
  let fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return
    }
  }
  test('create an answer', async () => {
    
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)
    const instructor = new Instructor("Belleti")
    const student = new Student("Henrriky")
    const question = new Question({
      title: 'Title question',
      content: 'Content question',
      authorId: student.id
    })
    const answer = await answerQuestion.execute({
      instructorId: instructor.id,
      questionId: question.id,
      content: 'Content answer'
    })

    expect(answer.content).toEqual('Content answer')
  })
  ```
  - Deve ser uma interface para que possamos implementar em qualquer lugar da aplicação e não depender de uma implementação específica, como o domínio é a camada mais interna ele não deve depender de camadas externas a ele.

## Value objects

- Slug: É uma representação do tipo da pergunta sem acentuação para melhorar a indexação no banco de dados e facilitar a busca, ou seja, ao invés de utilizar um id para representar a pergunta, usar uma representação da descrição dela.
- Esse slug pode ser apenas um texto sem acentos e espaços, por exemplo, `como-fazer-uma-pergunta`. No entanto, caso a nossa aplicação permita que o usuário crie perguntas com o mesmo nome, o slug não seria único, então isso significa que temos `regras de negócio` para a criação do slug. Diante disso, o DDD, diz que a gente deve trabalhar com `Value Objects`, que são objetos que não são entidades anêmicas e que realmente possuem uma validação por trás de cada propriedade, deixando isso de forma explicita na construção do objeto.
- Value Objects: propriedades das entidades que possuem regras de negócio associadas a elas.
- Exemplo:
  - Criar pasta `/domain/value-objects`
  - Criar uma classe `Slug`
  ```ts
  export class Slug {

    public value: string

    constructor (text: string) {
      this.value = text
    }

    /**
    * Receives a string and normalize it as a slug.
    * Example: "An example title" => "an-example-title"
    * 
    * @param text {string}
    */
    static createFromText (text: string) {
      const slugText = text
        .normalize("NFKD")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/_/g, '-')
        .replace(/--+/g, '-')
        .replace(/-$/g, '')

      return new Slug(slugText)
    }
  }
  ```
## Classe base das entidades

- Criar pasta `/core/entities` -> Compartilhamento de código reutilizável
  - Exemplo:
    - ID
    - props
    - uuid
  ```ts
  // Com esse código identificamos os pontos de repetição e refatoramos com uma classe Entity base que realiza a associação dos campos e da criação do ID de forma automatica.
  import { randomUUID } from "crypto"

  export class Entity<Props> {
    private _id: string
    protected props: Props

    get id() {
      return this._id
    }

    protected constructor(props: Props, id?: string) {
      this.props = props
      this._id = id ?? randomUUID()
    }
  }
  ```

## Path aliases e Vitest Globals

- Modificar tsconfig.json
  ```json
  "baseUrl": "./src",
  "paths": {
    "@domain/*": ["domain/*"],
    "@core/*": ["core/*"]
  },
  "types": [
      "vitest/globals"
  ], 
  ```
- Instalar o pacote do vitest para aliases nos testes `npm install vite-tsconfig-paths -D`
  - Após sua instalação, criar arquivo na raiz `vite.config.ts`
    ```ts
      import { defineConfig } from 'vite'
      import tsConfigPaths from 'vite-tsconfig-paths'

      export default defineConfig({
        plugins: [
          tsConfigPaths()
        ],
        test: {
          globals: true
        }
      })
    ```
## Configurar ESLINT

- `npm install eslint @rocketseat/eslint-config -D`
- `npm install eslint-plugin-vitest-globals -D`
- `.eslintrc`
  ```json
  {
    "extends": ["@rocketseat/eslint-config/node", "plugin:vitest-globals/recommended"],
    "env": {
      "vitest-globals/env": true
    }
  }
  ```
- `package.json`
  ```json
  "scripts": {
    "lint": "eslint --ext .ts src",
    "lint:fix": "eslint --ext .ts src --fix"
  }
  ```