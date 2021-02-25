# Cadastro

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/signup**.
2. ✅ Valida todos os dados obrigatórios **name**, **email**, **password**, **passwordConfirmation**.
3. ✅ Valida que **password** e **passwordConfirmation** são iguais.
4. ✅ Valida que **email** é um e-mail válido
5. ✅ Valida se já existe algum usuário com o e-mail provido.
6. ✅ Gera uma senha **criptografada**.
7. ✅ Cria uma conta para o usuário com os dados providos, substituindo o **password** pela senha criptografada.

> ## Exceções

1. ✅ Retorna erro 404 caso a API não exista.
2. ✅ Retorna erro 400 caso os dados obrigatórios não forem fornecidos.
3. ✅ Retorna erro 400 caso **password** e **passwordConfirmation** sejam diferentes.
4. ✅ Retorna erro 400 caso o e-mail provido não seja válido
5. ✅ Retorna erro 403 caso o e-mail já esteja em uso.
6. ✅ Retorna erro 500 caso a criptografia da senha falhe.
7. ✅ Retorna erro 500 caso a inserção do usuário falhe.
