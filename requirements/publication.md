# Publicação

> ## Caso de sucesso

1. 🕙 Recebe uma requisição do tipo **POST** na rota **/api/publication**.
2. 🕙 Valida que o usuário está logado.
3. 🕙 Valida que o campo **publication** foi provido.
4. 🕙 Valida que o campo **publication** tem no máximo 500 caracteres.
5. 🕙 Retorna **200** com a publicação.

> ## Exceções

1. 🕙 Retorna 404 caso a API não exista.
2. 🕙 Retorna 403 caso o usuário não esteja logado.
3. 🕙 Retorna 400 caso o **publication** não seja provido.
4. 🕙 Retorna 400 caso o **publication** tenha mais do que 500 caracteres.
5. 🕙 Retorna 500 caso a criação da publicação falhe.
