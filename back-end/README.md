# Sistema de Estágios - Backend

## Tasks atuais

* [x] Configurar testes login administrador
* [ ] Adicionar lib de validação dos dados dos corpos das requisições
* [ ] Adicionar lib para envio de emails
* [x] Configurar testes dos métodos do banco de dados
* [ ] Configurar husky para formatar o código ao fazer um commit
* [ ] Criar pipeline CI/CD do github para bloquear pull requests que não passarem nos testes
* [ ] Sanatizar os inputs do usuário para evitar vulnerabilidades
* [x] Configurar helmet para proteger o servidor de perigos comuns como XSS Atack
* [ ] Configurar bcrypt para proteger senhas
* [ ] Implementar rate limiting

### Próximas Tasks
- Adicionar rotas estudantes
- Adicionar rotas coordenadores
- Adicionar rotas usuários
- Adicionar testes rotas estudantes
- Adicionar testes rotas coordenadores
- Adicionar testes rotas usuários
- Adicionar rota para resetar senha com email de verificação
- Adicionar middleware de autorização de acordo com o tipo de usuário
- Configurar as migrations do sequelize para o ambiente de produção
- Configurar autenticação de dois fatores (qrcode e secret) com speakeasy
- Adicionar testes para rotas de emails
- Adicionar teste para rota de autenticação de dois fatores
- Configurar morgan para monitorar as requisições
