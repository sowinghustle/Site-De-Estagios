# Sistema de estágios

## Guia a ser seguida para os commits

Boas práticas a serem realizadas nos commits dessa e as outras branchs. **Favor, ler por completo.**

> **Tipos de Commit**

- **feat**: um novo recurso foi introduzido com as alterações.
- **fix**: ocorreu uma correção de bug.
- **chore**: alterações que não estão
  relacionadas a uma correção ou recurso e não modificam os arquivos src ou de teste (por exemplo, atualização de dependências).
- **refactor**: código refatorado que não corrige um bug nem adiciona um
  recurso.
- **docs**: atualizações da documentação, como o README ou outros arquivos
  markdown.
- **style**: alterações que não afetam o significado do código,
  provavelmente relacionadas à formatação do código, como espaços em branco, falta de ponto e vírgula e assim por diante.
- **test**: inclusão de novos testes ou correção de testes anteriores.
- **perf**: melhorias de desempenho.
- **ci**: relacionado à integração contínua.
- **build**: alterações que afetam o sistema de build ou dependências
  externas.
- **revert**: reverte um commit anterior.

> Escopo do commit

_Um escopo deve incluir um substantivo entre parênteses que descreva a parte da base de código que será afetada pelas alterações. Exemplo:_

    feat(produtos)
    fix(pagamento)
    style(login)

> Assunto

_Forneça um breve resumo de uma linha das alterações aplicadas._

- Limite a linha de assunto a 50 caracteres.
- Ela não deve estar em branco e não deve conter espaços em branco ou
  pontuações.
- Não termine a linha de assunto com um ponto final.
- Use o tempo presente ou o modo imperativo na linha de assunto.

_Exemplos:_

     - feat(products): busca de produtos com código de barras

     - fix(payment): processa vários pagamentos

     - style(login): atualizar o botão do formulário de login

## **Corpo**

_Use o corpo para descrever suas modificações e por que você as fez._

- Uma linha em branco deve ser usada para separar o assunto do corpo.
- Cada linha não deve ter mais de 72 caracteres.
- Não presuma que o revisor conhece o problema original; certifique-se
  de incluí-lo.
- Não acredite que seu código seja autoexplicativo.

_Exemplo:_

    fix(payment): processar vários pagamentos


    ALTERAÇÃO DE QUEBRA: corrige o bug que desabilitava o método de pagamento para executar vários pagamentos ao mesmo tempo.
