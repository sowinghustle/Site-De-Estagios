Estrutura do diretório `front-end` :

```
├── .expo/                        # Configurações internas e dados do Expo
├── app/                          # Código-fonte principal do aplicativo
|   └── _layout.tsx               # Layout e a estrutura de navegação
|   └── index.tsx                 # Pagina principal da aplicação
├── app-example/                  # Exemplo ou protótipo do aplicativo (pode ser uma versão de teste ou uma referência)
├── assets/                       # Recursos estáticos (imagens, fontes, etc.)
├── components/                   # Componentes reutilizáveis do React
├── constants/                    # Constantes e variáveis globais
├── hooks/                        # Hooks personalizados do React
├── node_modules/                 # Dependências instaladas
├── scripts/                      # Scripts auxiliares ou de automação
├── .gitignore                    # Arquivos e pastas a serem ignorados pelo Git
├── app.json                      # Configurações do Expo (nome, ícones, etc.)
├── babel.config.js               # Configuração do Babel
├── expo-env.d.ts                 # Declarações de tipos TypeScript para variáveis de ambiente do Expo
├── Important-Info.md             # Informações importantes sobre o projeto
├── package-lock.json             # Versões exatas das dependências (npm)
├── package.json                  # Dependências e scripts do projeto (npm)
├── README.md                     # Descrição e instruções do projeto
├── tsconfig.json                 # Configuração do TypeScript
└── yarn.lock                     # Versões exatas das dependências (Yarn)
```

A estrutura do diretório `back-end` :

```
├── .husky/                       # Configurações de hooks do Git (Husky)
├── dist/                         # Código compilado (JavaScript) gerado a partir do TypeScript
├── node_modules/                 # Dependências instaladas
├── src/                          # Código-fonte do servidor (arquivos TypeScript)
├── .nvmrc                        # Versão do Node.js a ser utilizada
├── .prettierignore                # Arquivos/pastas a serem ignorados pelo Prettier
├── .prettierrc.json              # Configuração do Prettier
├── package-lock.json             # Versões exatas das dependências (npm)
├── package.json                  # Dependências e scripts do projeto (npm)
└── tsconfig.json                 # Configuração do TypeScript
```
