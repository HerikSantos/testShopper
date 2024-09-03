### Customer
    [POST] - /customer - Cria um novo cliente

        Request:
            body {
                name: string;
                lastname: string;
                email: string;
                password: string
                passwordConfirmation: string;
            }

        Response:
            200,

            400 {
                message: Cliente já existe
            },

            400 {
                message: Email inválido
            }
