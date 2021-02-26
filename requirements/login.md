# Login

> ## Caso de sucesso

1. 🕙 Recebe uma requisição do tipo **POST** na rota **/api/login**.
2. 🕙 Valida todos os dados necessários (**email** e **password**)
3. 🕙 Valida que o **email** provido é válido
4. 🕙 Valida que existe uma conta com o e-mail provido.
5. 🕙 Valida que a senha provida é a mesma que a da conta encontrada pelo e-mail.
6. 🕙 Gera um token de acesso para o usuário.
7. 🕙 Atualiza o token salvo no banco de dados pelo novo.
8. 🕙 Retorna **204** caso tudo funcione como o esperado.

> ## Exceções

1. 🕙 Retorna 404 caso a API não exista.
2. 🕙 Retorna 400 caso os dados obrigatórios não forem fornecidos.
3. 🕙 Retorna 400 caso o e-mail provido não seja válido.
4. 🕙 Retorna 401 caso a senha provida não seja a mesma que a salva no banco de dados.
5. 🕙 Retorna 500 caso a geração de token falhe.
6. 🕙 Retorna 500 caso a atualização do token na conta do usuário falhe.
