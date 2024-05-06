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
- [] Criar testes unitários para o `Delete Question Use Case`