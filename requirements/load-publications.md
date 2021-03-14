# Carregar Publicações

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/publications/user_id**.
2. ✅ Valida que o usuário está logado.
3. ✅ Retorna **200** com as publicações.
4. ✅ Retorna **204** caso não tenha nenhuma publicação.

> ## Exceções

1. ✅ Retorna 404 caso a API não exista.
2. ✅ Retorna 403 caso o usuário não esteja logado.
3. ✅ Retorna 500 caso o carregamento das **publications** falhe.
