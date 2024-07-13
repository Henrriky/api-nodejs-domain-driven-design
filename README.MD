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

# Fundamentos da Clean Architecture

- Quando falamos em `Design de Software` estamos focados em como vamos converter uma problema ou necessidade real de um cliente em um software, ou seja, quando falamos de projeto ou design de software a ideia é focar em como vamos resolver o problema do cliente e não em como vamos implementar o software.
  - Exemplos: BDD (Behavior Driven Design), TDD (Test Driven Design) e DDD (Domain Driven Design),
- Por outro lado a `Arquitetura de Software` já tem uma relação mais forte de como vamos implementar o código da aplicação.
  - Exemplos: 
    - Arquitetura em camadas (Layered Architecuture)
    - Arquitetura Client-Servidor (Client Server Architecture)
    - Arquitetura Orientada a Serviços (Service Oriented Architecture)
    - Arquitetura Event Driven Design (Event Driven Architecture) 
    - Arquitetura Hexagonal (Hexagonal Architecture) 
    - Arquitetura Limpa (Clean Architecture)
- A base da `Arquitetura Limpa` é o conceito de **desacoplamento** que nada mais é que a capacidade de uma parte do software ser alterada sem que isso afete outras partes do software, ou seja, elas devem ser independentes.
- Cada um dos circulos do diagrama da `Clean Architecture` representam cada parte da aplicação, onde o círculo mais interno é o mais importante, pois é o que contém as regras de negócio do software.


## Camadas da Clean Architecture

- O usuário vem de fora para dentro, ou seja, ele se comunica através da camada mais externa, como: `UI`, `Controllers`
- Cada um dos circulos do diagrama da `Clean Architecture` representam cada parte da aplicação, onde o círculo mais interno é o mais importante, pois é o que contém as regras de negócio do software.
- Cada flecha das camadas representam a dependência entre elas. Por exemplo, a camada azul depende da camada verde, a camada verde depende da camada amarela e assim por diante.
- Um caso de uso pode chamar uma entidade, mas uma entidade não pode chamar um caso de uso.
  - Na camada azul de `Frameworks & Drivers` geralmente ficam coisas externas (forma da aplicação se comunicar com o mundo externo): 
    - Chamada de camada de **INFRA** (Infraestrutura)
    - `UI (GUI, CLI)`
    - `External Interfaces (RabbitMQ, Redis Pub Sub, Services, gRPC)`
    - `DB (MySQL, PostgreeSQL, MongoDB, Redis Cache)`
    - `Devices (Android, IOS)`
    - `WEB (Javascript Fetch)`

  - Na camada verde de `Interface Adapters`, geralmente é aonde ficam localizados os recursos que vão adapter as informações que são recebidas na camada superior (azul) para as camadas mais internas. Alguns dos recursos que podem ser encontrados nessa camada são:
    - Chamada de camada de **ADAPTER** (Adaptadores)
    - `Controllers (Express, Koa, Fastify)`: Os controllers são responsáveis por receber as solicitações externas do sistema, interpretá-las e acionar as ações apropriadas nos casos de uso correspondentes. Eles servem como uma camada intermediária entre as interfaces externas (como interfaces de usuário ou serviços web) e os casos de uso da aplicação. Os controllers não contêm lógica de negócios, mas simplesmente coordenam o fluxo de execução com base nas solicitações recebidas.
    - `Gateways`: Geralmente interfaces abstratas que permitem que a camada verde interaja com recursos externos, como bancos de dados, serviços web ou sistemas legados. Eles encapsulam a lógica de acesso e comunicação com esses recursos externos, garantindo que a camada de negócios permaneça independente de detalhes de implementação específicos. Por exemplo, um gateway de banco de dados pode definir métodos para buscar, salvar, atualizar ou excluir dados de um banco de dados, enquanto oculta os detalhes de acesso específicos do banco de dados.
    - `Presenters (Serializers, ViewModels)`:  Os presenters são responsáveis por converter os dados retornados pelos casos de uso em um formato adequado para ser apresentado nas interfaces de usuário. Eles formatam e estruturam os dados para atender às necessidades das interfaces de usuário específicas. Os presenters são especialmente úteis em arquiteturas em que a interface de usuário é separada da lógica de negócios, como em aplicações web onde o back-end e o front-end são desacoplados.
    - No final das contas, o objetivo dessa camada é proteger a camada mais interna das implementações das camadas mais externas (azul). Isso quer dizer que podemos utilizar os principios SOLID como inversão de depêndencia para que a camada mais interna não dependa de implementações de camadas mais externas.
    - Nossos casos de uso não devem depender diretamente da camada de **INFRA**

  - Na camada vermelha `Application Business Rules`:
    - Esta é uma das camadas mais interna e central da arquitetura, onde residem as regras de negócio principais da aplicação. Ela é composta por entidades de domínio e casos de uso que encapsulam a lógica de negócio da aplicação.
    - `Entities (Entidades)`: Representam os objetos fundamentais e conceitos de negócio da aplicação. Elas encapsulam estado e comportamento relacionados a um conceito de negócio específico e são independentes de qualquer detalhe de implementação externa.
    - `Use Cases (Casos de Uso)`: Representam as diferentes funcionalidades e processos que o sistema oferece aos usuários. Cada caso de uso encapsula uma operação específica do sistema e coordena a interação entre as entidades e os gateways para realizar a funcionalidade desejada.
  
  - Na camada amarela `Enterprise Business Rules`:
    - Esta camada contém regras de negócio de nível mais alto que são específicas do domínio da aplicação. Ela é responsável por coordenar e orquestrar a execução de casos de uso e garantir que as regras de negócio sejam aplicadas de forma consistente em toda a aplicação.
    - Esta camada serve como uma interface entre as regras de negócio na camada vermelha e as estruturas de dados externas. Ela inclui entidades de banco de dados e estruturas de dados específicas do framework que são usadas para persistir dados ou representar informações na interface com o usuário.
    - Database Entities (Entidades de Banco de Dados): São estruturas de dados que representam entidades de negócio em um formato adequado para armazenamento e recuperação em um banco de dados.
    - Frameworks Entities (Entidades de Frameworks): São estruturas de dados específicas do framework ou da tecnologia utilizada na camada de Frameworks & Drivers que são usadas para representar informações na interface com o usuário. Por exemplo, DTOs (Data Transfer Objects) em uma aplicação web.

## Refatorando código

- Como o projeto tem como objetivo a abordagem do DDD, nos vamos chamar os `Use Cases` e `Entities` de **Domain**
  - As entidades e casos de uso fazem parte do domínio, que é a area de conhecimento do problema que estamos abstraindo para um software.
  - Além disso, uma aplicação do DDD podem ter vários `Subdomains`, que são uma espécie de "setores" do problema que estamos resolvendo, e que geralmente são dividos em pasta e módulos, ou no caso de microserviços, em serviços diferentes.
    - Eles são muito úteis para identificar microserviços e separar a aplicação em partes menores e mais gerenciáveis.
  - Vamos criar um `Subdomain` chamado de `forum`
    - Criar pasta `/domain/forum/application` -> Indica os casos de uso da arquitetura limpa
      - Repositories
      - Use cases
    - Criar pasta `/domain/forum/enterprise` -> Indica as entities da arquitetura limpa
      - Entities

# Casos de uso

## Caso de uso Criar Pergunta

- Criação de um sistema de fórum:
  - Perguntas
    - Podem ser respondidas por alunos ou instrutores.
    - Comentários.
  - Resposta.
    - Comentários.
```ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/Question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseInput {
  authorId: string
  title: string
  content: string
}

interface CreateQuestionUseCaseOutput {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return {
      question,
    }
  }
}
```

## Refatorando testes unitários

- Extrair lógica de in memory repository para um arquivo separado
```ts
export class InMemoryAnswersRepository implements AnswersRepository {
  private answers: Answer[] = []

  async create(answer: Answer) {
    this.answers.push(answer)
  }
}
export class InMemoryQuestionsRepository implements QuestionsRepository {
  private questions: Question[] = []

  async create(question: Question) {
    this.questions.push(question)
  }
}

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let usecase: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    usecase = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await usecase.execute({
      authorId: '1',
      title: 'New question',
      content: 'Content question',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionRepository.questions[0].id).toBe(question.id)
  })
})
```

## Caso de uso: Buscar pergunta pelo slug (descrição breve)

- [X] Criar `Get Question By Slug Use Case`
  - [X] Deve chamar o método `findBySlug` do `QuestionsRepository`
  - [X] Deve verificar se a Question existe, caso contrário retornar um erro indicando que a pergunta não foi encontrada
- [X] Criar `QuestionsRepository` com método `findBySlug` que pode retornar uma entidade `Question` ou `null`
  - [X] Criar implementação do método `findBySlug` no `InMemoryQuestionsRepository`
- [ ] Criar testes unitários para o `Get Question By Slug Use Case`

### Factories dos testes

- É comum no desenvolvimento de novos testes ter que instanciar diversas classes, para evitar repetição, podemos fazer uma factory da criação dessas entidades.
- Passos:
  - Criar pasta `factories`
  - Criar arquivo `make-question.ts`

### Gerando dados ficticios

- Utilizar a biblioteca faker
- `npm i @faker-js/faker -D`

## Caso de uso: Remover uma pergunta

- [X] Criar `Delete Question Use Case`
  - [X] Deve utilizar o método `findById` do `QuestionRepository`
  - [X] Deve verificar se a `Question` do id existe ou não, caso não exista retornar um erro indicando que a pergunta não foi encontrada
  - [X] Deve verificar se o `authorId` da `Question` é igual ao `authorId` passado no input, caso não seja, retornar um erro indicando que o usuário não tem permissão para deletar a pergunta
  - [X] Deve chamar o método `delete` do `QuestionRepository`
- [X] Criar `QuestionsRepository` com o método `delete` que recebe a `Question` e o método `findById` que recebe o id da `Question` e retorna a `Question` ou `null`
  - [X] Criar implementação do método `delete` no `InMemoryQuestionsRepository`
  - [X] Criar implementação do método `findById` no `InMemoryQuestionsRepository`
- [X] Criar testes unitários para o `Delete Question Use Case`

## Caso de uso: Deletar uma resposta

- [X] Criar `Delete Answer Use Case`
  - [X] Deve utilizar o método `findById` do `AnswerRepository`
  - [X] Deve verificar se a `Answer` do id existe ou não, caso não exista retornar um erro indicando que a pergunta não foi encontrada
  - [X] Deve verificar se o `authorId` da `Answer` é igual ao `authorId` passado no input, caso não seja, retornar um erro indicando que o usuário não tem permissão para deletar a pergunta
  - [X] Deve chamar o método `delete` do `AnswerRepository`
- [X] Criar `AnswersRepository` com o método `delete` que recebe a `Answer` e o método `findById` que recebe o id da `Answer` e retorna a `Answer` ou `null`
  - [X] Criar implementação do método `delete` no `InMemoryAnswersRepository`
  - [X] Criar implementação do método `findById` no `InMemoryAnswersRepository`
- [X] Criar testes unitários para o `Delete Answer Use Case`

## Caso de uso: Editar uma pergunta

## Caso de uso: Escolher melhor resposta

## Caso de uso: Listar perguntas mais recentes

- Função `sort`
  - Deve retornar um **Número negativo** se A deve vir antes de B.
  - Deve retornar um **Número positivo** se A deve vir depois de B.
  - Para colocar em ordem decrescente invertemos a verificação
  - Dado que A deve vir depois de B se o número resultante for positivo, então se invertermos a operação teremos o resultado oposto
    - Exemplo ASC: 1 - 5 = -4 (A vai antes de B)
    - Exemplo DESC: 5 - 1 = 4 (A vai depois de B)

# Entidade comentário

- É normal em um sistema de fórum termos comentários de respostas que não necessariamente são respostas mas que estão atreladas a ela.
- Para criar essa entidade de domínio, vamos defini-la da seguinte forma:
  ```ts
  export interface AnswerCommentProps {
    answerId: UniqueEntityID
    authorId: UniqueEntityID
    content: string
    createdAt: Date
    updatedAt?: Date
  }

  export class AnswerComment extends Entity<AnswerCommentProps> {
    get authorId() {
      return this.props.authorId
    }

    get answerId() {
      return this.props.answerId
    }

    get content() {
      return this.props.content
    }

    get createdAt() {
      return this.props.createdAt
    }

    get updatedAt() {
      return this.props.updatedAt
    }

    private touch() {
      this.props.updatedAt = new Date()
    }

    set content(content: string) {
      this.props.content = content
      this.touch()
    }

    static create(
      props: Optional<AnswerCommentProps, 'createdAt'>,
      id?: UniqueEntityID,
    ) {
      const answerComment = new AnswerComment(
        {
          ...props,
          createdAt: props.createdAt ?? new Date(), 
        },
        id,
      )

      return answerComment
    }
  }
  ```
- Criar também `QuestionComment`

## Classe base de comentários

- Criar classe para herdar algumas propriedades em comum dos comentários
  ```ts
    import { Entity } from '@/core/entities/entity'
    import { UniqueEntityID } from '@/core/entities/unique-entity-id'

    export interface CommentProps {
      authorId: UniqueEntityID
      content: string
      createdAt: Date
      updatedAt?: Date
    }

    export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
      get authorId() {
        return this.props.authorId
      }

      get content() {
        return this.props.content
      }

      get createdAt() {
        return this.props.createdAt
      }

      get updatedAt() {
        return this.props.updatedAt
      }

      private touch() {
        this.props.updatedAt = new Date()
      }

      set content(content: string) {
        this.props.content = content
        this.touch()
      }
    }
  ```

# Casos de uso de Comentários

- [X] Criar comentário na pergunta
- [X] Criar comentário na resposta
- [X] Deletar comentário da pergunta
- [X] Deletar comentário da resposta
- [X] Listar comentários da pergunta

# Problema com Error Handling

- https://khalilstemmler.com/articles/enterprise-typescript-nodejs/handling-errors-result-class/
- https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/
- https://blog.bitsrc.io/a-clean-and-adaptive-nodejs-architecture-with-typescript-b144c1735447
- Devemos padronizar a forma de tratativa de erro na aplicação

## Functional Error Handling

- https://gigobyte.github.io/purify/ -> Biblioteca de programação funcional
- Em linguagens funcionais, é comum a utilização de tuplas para representar se a resposta é de sucesso (extrair valor) ou erro (extrair razão)
- Para isso vamos criar um arquivo `either.ts` em `core/either.ts`

### Testando classes de erro

- Escrever testes unitários para o either.ts
```ts
import { Either, failure, success } from "./either"

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if(shouldSuccess) {
    return success(10)
  } else {
    return failure('failure')
  }
}

test('success result', () => {

  const result = doSomething(true)

  if (result.isSuccess()) {
    console.log(result.value)
  }

  expect(result.isSuccess()).toBe(true)
  expect(result.isFailure()).toBe(false)
})

test('failure result', () => {

  const result = doSomething(false)

  expect(result.isSuccess()).toBe(false)
  expect(result.isFailure()).toBe(true)
})
```
- Além disso, precisamos modificar o `either.ts` para que ele tenha dois método `isSuccess` e `isFailure`, para que seja possível identificar qual é o resultado de uma operação. Outra coisa que vamos fazer é forçar a tipagem desses dois métodos para que ele identifique que ela é da respectiva classe com um valor definido.
```ts
// Error
export class Failure<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isSuccess(): this is Success<L, R> {
    return false
  }

  isFailure(): this is Failure<L, R> {
    return true
  }
}

// Success
export class Success<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isSuccess(): this is Success<L, R> { //Indicação para o Typescript que estamos assumindo que o retorno da variável value será do tipo Right
    return true
  }

  isFailure(): this is Failure<L, R> {
    return false
  }
}

export type Either<L, R> = Failure<L, R> | Success<L, R>

export const failure = <L, R>(value: L): Either<L, R> => {
  return new Failure(value)
}

export const success = <L, R>(value: R): Either<L, R> => {
  return new Success(value)
}
```

# Criação de erros genéricos

- Criação de uma pasta `errors`
  - Dentro dessa pasta vamos criar erros que serão disparados na lógica de negócio e que vão estender de `UseCaseError`, que contém uma mensagem:
    ```ts
    import { UseCaseError } from "@/core/error/use-case-error";

    export class ResourceNotFoundError extends Error implements UseCaseError {
      constructor() {
        super('Resource not found')
      }
    }
    export class NotAllowedError extends Error implements UseCaseError {
      constructor() {
        super('Not allowed')
      }
    }
    ```

# AggregateRoot & WatchedList

Anotar momento que pegou pressão

- Aggregate
  - Entidades que dependem de outras entidades para existir.
  - Conjunto de entidades que são manipuladas ao mesmo tempo, e elas juntas compoem algo maior que é o Aggregate
  - Exemplo:
    - Order (Entidade principal)
      - As outras entidades abaixo dependem exclusivamente da existência da entidade principal
      - Os agregados são entidades que sempre trabalham juntas, nunca sozinhas
        - Exemplo: Order e OrderItem são salvos juntos no banco de dados, configurando um agregado
      - OrderItem[]
      - Shipping
- WatchedList
  - É uma classe ou pattern que permite que a gente tenha mais informações de itens contidos dentro de uma lista.
  - Isso quer dizer que cada item dentro de um array também tem informações se aquilo é algo novo, algo que foi removido ou algo que foi atualizado.
  - Exemplo:
    - Question -> Attachment[] (Aggregate de Question + Attachment)
    - Criação:
      - Título
      - Conteúdo
      - Anexos (3)
    - Edição
      - Título 
      - Conteúdo
      - Podemos fazer a seguinte operação em cima dos Anexos da Pergunta:
        - Adicionar um novo anexo (CREATE)
        - Remover o segundo anexo que tinha sido criado previamente (DELETE)
        - Editar um anexo existente (UPDATE)
        - Logo, o trabalho de manipular listas dentro de um agregado começa a se tornar mais complexo, pois podemos adicionar mais informações naquela lista ou editar/remover informações existentes.
        - Não podemos simplesmente apagar todos os anexos que haviam salvos previamente no momento da criação e recriar com base nos que vieram, devemos atualizar apenas os que foram alterados

## AggregateRoot

- CQRS
- Criar um `AggregateRoot`
- Alterar herança de Question para AggregateRoot
- Agora vamos começar a ter relacionamentos que vão ser manipulados ao mesmo tempo que a Question for manipulada, como por exemplo os `Anexos` da pergunta e as `Tags`. Isso quer dizer que todas essas entidades vão ser tratadas juntas
- AggregatesRoot não são um simples relacionamento, eles são um conjunto de entidades que são mutadas de forma conjunta. Por exemplo, Question e QuestionComments não são um AggregateRoot, pois o comentário só é feito depois da criação da Question, e a edição de um não influencia a de outro diretamente.

# Entidades de Anexo

- Tanto as `Question`, quanto as `Answers` teremos `Attachements`
- A melhor abordagem é criar uma classe separada para `Attachements`
  - Podemos trabalhar com polimorfismo na orientação a objeto para representar o `Attachement`, que é uma forma de uma classe se comportar de duas formas, usando apenas o type.
  - Vamos criar duas entidades "Pivo", que é `Answer-Attachement` e `Question-Attachement`
  ```ts
  export interface AttachementProps {
    title: string
    link: string
  }

  export class Attachement extends Entity<AttachementProps> {
    
    public get title() {
      return this.props.title
    }

    public get link() {
      return this.props.link
    }
  }

  interface QuestionAttachementProps {
    questionId: UniqueEntityID
    attachmentId: UniqueEntityID
  }


  export class QuestionAttachement extends Entity<QuestionAttachementProps> {
    
    public get questionId() {
      return this.props.questionId
    }

    public get attachementId() {
      return this.props.questionId
    }


    static create(
      props: QuestionAttachementProps,
      id?: UniqueEntityID,
    ) {
      const questionAttachement = new QuestionAttachement(props, id)

      return questionAttachement
    }
  }  
  ```

## Criando pergunta com anexos

- Vamos modelar `Question` para ter um `QuestionAttachements`
  ```ts
  export interface QuestionProps {
    authorId: UniqueEntityID
    bestAnswerId?: UniqueEntityID
    attachments: QuestionAttachment[]
    title: string
    content: string
    slug: Slug
    createdAt: Date
    updatedAt?: Date
  }

  export class Question extends AggregateRoot<QuestionProps> {

    set attachments(attachments: QuestionAttachment[]) {
      this.props.attachments = attachments
    }

    static create(
      props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
      id?: UniqueEntityID,
    ) {
      const question = new Question(
        {
          ...props,
          slug: props.slug ?? Slug.createFromText(props.title),
          attachments: props.attachments ?? [],
          createdAt: props.createdAt ?? new Date(),
        },
        id,
      )

      return question
    }
  }
  ```
- Agora precisamos alterar nosso caso de uso `Create Question`
  - Os attachements são "multipart/form-data", que não é JSON e sim um formato binário.
  - O ideal é separar a criação dos attachements da questão, e depois receber os ids dos attachements para realizar a relação entre Question e Attachements.
  ```ts
  interface CreateQuestionUseCaseInput {
    authorId: string
    title: string
    content: string
    attachmentsIds: string[]
  }

  type CreateQuestionUseCaseOutput = Either<
    null, 
    {
      question: Question
    }
  >

  export class CreateQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
      authorId,
      title,
      content,
      attachmentsIds,
    }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
      const question = Question.create({
        authorId: new UniqueEntityID(authorId),
        title,
        content,
      })

      const questionAttachments = attachmentsIds.map(attachmentId => {
        return QuestionAttachment.create({
          attachmentId: new UniqueEntityID(attachmentId),
          questionId: question.id
        })
      })

      question.attachments = questionAttachments

      await this.questionsRepository.create(question)

      return success({
        question,
      })
    }
  }

  
  ```
  - Outra questão é que, para salvar os `Attachments`, ao salvar eles seguindo o conceito de `AggregateRoot`, o ideal é que o `QuestionRepository`, que é o repositorio do Agregado principal, deve criar e salvar automáticamente todos os `SubAggregates`. Ou seja, quando salvarmos uma `Question` no banco de dados, o próprio `QuestionRepository` tem que lidar com a parte de `create, delete and save` do banco de dados.
  - No primeiro momento, como temos a entidade `Question` como um todo, ela já possui os `Attachments`, mas quando tivermos um Banco de Dados, será necessário salvar essas informações no banco de forma separada.

# Pattern - WatchedList

- Criação de uma classe abstrata:
```ts
import { WatchedList } from "./watched-list";


class NumberWatchedList extends WatchedList<number> {

  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('watched list', () => {

  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.currentItems).toHaveLength(3)
  })

  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])
  
    list.add(4)
    
    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])
  
    list.remove(2)
    
    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3])
  
    list.remove(2)
    list.add(2)
    
    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was add before', () => {
    const list = new NumberWatchedList([1, 2, 3])
  
    list.add(4)
    list.remove(4)
    
    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])
    
    list.update([1, 3, 5])
    
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
    expect(list.currentItems).toHaveLength(3)
    expect(list.currentItems).toEqual([1, 3, 5])
  })
})
```
- Agora precisamos criar nossa `QuestionAttachmentList` para poder armazenar apenas os `attachmentsIds` que de fato foram adicionados ou que devem ser removidos.
```ts
import { WatchedList } from "@/core/entities/watched-list";
import { QuestionAttachment } from "./Question-Attachment";

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
```

# Alterando casos de uso

- Agora é necessário alterar os casos de uso que vão receber os `Attachments`

## Alterando caso de uso Criar Pergunta
- Primeiro vamos atualizar o `Question` para que ele tenha uma referência para `QuestionAttachmentList` e alterar o Input do `Create Question Use Case`:
```ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/Question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, success } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/Question-Attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/Question-Attachment-List'

interface CreateQuestionUseCaseInput {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseOutput = Either<
  null, 
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return success({
      question,
    })
  }
}
```

## Alterando caso de uso Editar Pergunta

- Para realizar a operação de `Edit Question` agora precisamos criar um `Question Attachments Repository`, pois nem sempre teremos a referência da lista de attachments quando buscarmos uma `Question`, o que pode causar um comportamento inesperado e também uma sobrecarga de dados que forem resgatados.
- Para isso, vamos altera a Porta (Input) do nosso caso de uso para suportar o atributo `attachmentIds` e também um `Question Attachments Repository`, para que a gente possa realizar a busca de quais os attachments que estão relacionados com a nossa pergunta
```ts
interface EditQuestionUseCaseInput {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseOutput = Either<
  ResourceNotFoundError | NotAllowedError, 
  {
  question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds
  }: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError('Question not found'))
    }

    if (question.authorId.toString() !== authorId) {
      return failure(new NotAllowedError('You are not the author of this question'))
    }

    const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    question.attachments = new QuestionAttachmentList(currentQuestionAttachments)


    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(attachmentId)
      })
    })

    question.attachments.update(questionAttachments)
    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
    return success({ question })
  }
}
```

## Excluindo anexos da pergunta

- Deletar uma pergunta também deve deletar todos os attachments relacionados
- Para fazer isso vamos receber dentro de um repository, a interface para outro repository

# Subdominios

- Core: O que é necessário
- Supporting: O que dá suporte para o core funcionar
- Generic: O que o cliente precisa, mas que não importa

## Exemplos

### Core

- Compra
- Catalogo
- Pagamento
- Entrega
- Faturamento

### Supporting

- Estoque

### Generic

- Notificações ao cliente
- Promoções
- Chat

## Subdomínio de notificações

- Estrutura geral:
  - `src/domain/forum`
    - `src/domain/forum/application`
      - `application/gateways`
        - `gateways/repositories`
        - `gateways/services`
      - `application/use-cases`
        - `use-cases/errors`
    - `src/domain/forum/enterprise`
      - `enterprise/entities`
      - `enterprise/value-objects`
  - `src/infra`
- Criar pasta do subdomain notification em domain
  - Criar `domain/notification/application`: 
    - `application/repositories`: Interfaces que possuem um contrato, e que permitem que os casos de uso utilizem eles para se comunicar com a camada anterior a eles, que é a de infra.
    - `application/use-cases`: Funcionalidades do negócio ou domínio, que utilizam os `Gateways` ou `Contracts` para se comunicar com uma camada mais acima.
    - `application/use-cases/errors`: Erros de domínio
  - Criar `domain/notification/enterprise`
    - `enterprise/entities`: Contém os modelos de domínio
    - `enterprise/entities/value-objects`: Contém os objetos de valor que são usados pelas entidades
```ts
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface NotificationProps {
  recipientId: UniqueEntityID
  title: string
  message: string
  createdAt: Date
  readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get message() {
    return this.props.message
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )

    return notification
  }
}
```
- Como o domínio core e os subdomínios são coisas independentes, não podemos criar um pensando no outro, pois isso implica em um acoplamento maior, para evitar que isso aconteça, é necessário pensar na Notificação como algo independente, que não depende diretamente do domínio Forum
- Para que a gente realiza a integração entre dois domínios são utilizados DomainEvents


### Casos de uso

#### Envio de notificação

- [X] Como autor da Pergunta, Resposta ou Comentário quero receber uma notificação do sistema quando alguma coisa mudar, para que possa acompanhar o recurso.
- Lógica:
  - Criação do caso de uso Enviar Notificação
    - Criar notificação recebida pelo Input
    - Retornar notificação criada
  - Criação NotificationRepository (Gateway or Port)
  - Criação do InMemoryNotificationsRepository (Infra, Adapter or Implementation)
  - Criação do teste Enviar Notificação que utiliza InMemoryNotificationsRepository

### Ler notificação

- [X] Como destinatário da notificação quero ser capaz de ler a notificação e ver o conteúdo dela, para que eu possa ficar informado do que aconteceu.
- Lógica:
  - Criação do caso de uso Ler Notificação
    - Modificar a notificação para lida, baseado no id recebido pelo Input
    - Retornar notificação atualizada
  - Criação do método `update` em NotificationRepository (Gateway or Port)
  - Criação do InMemoryNotificationsRepository (Infra, Adapter or Implementation)
  - Criação do teste Enviar Notificação que utiliza InMemoryNotificationsRepository