describe('Funcionalidade de Cadastro de Usuário', () => {
    beforeEach(() => {
        cy.visit('frontend/index.html');
    });

    it('Cenário 01: Preenchimento Completo e Correto do Formulário', () => {
        cy.get('註冊表單').shadow().find('#姓名').type('Test User');
        cy.get('註冊表單').shadow().find('#電郵').type('testuser@example.com');
        cy.get('註冊表單').shadow().find('#密碼').type('Password123');
        cy.get('註冊表單').shadow().find('#確認密碼').type('Password123');

        cy.intercept('POST', '/register', {
            statusCode: 200,
            body: { message: 'Cadastro realizado com sucesso.' }
        }).as('registerUser');

        cy.get('註冊表單').shadow().find('提交按鈕').shadow().find('button').click();

        cy.wait('@registerUser').then(() => {
            cy.get('註冊表單').shadow().find('訊息').shadow().find('#訊息').should('contain', 'Cadastro realizado com sucesso.');
            // Verificar se os campos foram limpos
            cy.get('註冊表單').shadow().find('#姓名').should('have.value', '');
            cy.get('註冊表單').shadow().find('#電郵').should('have.value', '');
            cy.get('註冊表單').shadow().find('#密碼').should('have.value', '');
            cy.get('註冊表單').shadow().find('#確認密碼').should('have.value', '');
        });
    });

    it('Cenário 02: Campos Obrigatórios Não Preenchidos', () => {
        // Interceptar a requisição e retornar erros de validação
        cy.intercept('POST', '/register', {
            statusCode: 400,
            body: { errors: ['姓名是必填項目', '電郵是必填項目', '密碼是必填項目', '確認密碼是必填項目'] }
        }).as('registerUserMissingFields');

        // Submeter o formulário sem preencher os campos
        cy.get('註冊表單').shadow().find('提交按鈕').shadow().find('button').click();

        cy.wait('@registerUserMissingFields');

        cy.get('註冊表單').shadow().find('訊息').shadow().find('#訊息').should('contain', '姓名是必填項目<br>電郵是必填項目<br>密碼是必填項目<br>確認密碼是必填項目');
    });

    it('Cenário 03: Senhas Não Coincidem', () => {
        cy.get('註冊表單').shadow().find('#姓名').type('Test User');
        cy.get('註冊表單').shadow().find('#電郵').type('testuser@example.com');
        cy.get('註冊表單').shadow().find('#密碼').type('Password123');
        cy.get('註冊表單').shadow().find('#確認密碼').type('Password321');

        cy.intercept('POST', '/register', {
            statusCode: 400,
            body: { errors: ['密碼和確認密碼不一致'] }
        }).as('registerUserPasswordMismatch');

        cy.get('註冊表單').shadow().find('提交按鈕').shadow().find('button').click();

        cy.wait('@registerUserPasswordMismatch');

        cy.get('註冊表單').shadow().find('訊息').shadow().find('#訊息').should('contain', '密碼和確認密碼不一致');
    });

    it('Cenário 04: Submissão Assíncrona dos Dados', () => {
        // Interceptar a requisição para evitar recarregamento da página
        cy.intercept('POST', '/register', {
            statusCode: 200,
            body: { message: 'Cadastro realizado com sucesso.' }
        }).as('registerUser');

        cy.get('註冊表單').shadow().find('#姓名').type('Test User');
        cy.get('註冊表單').shadow().find('#電郵').type('testuser@example.com');
        cy.get('註冊表單').shadow().find('#密碼').type('Password123');
        cy.get('註冊表單').shadow().find('#確認密碼').type('Password123');

        cy.get('註冊表單').shadow().find('提交按鈕').shadow().find('button').click();

        cy.wait('@registerUser');

        // Verificar que a página não foi recarregada mantendo o formulário visível
        cy.get('註冊表單').shadow().find('.form-container').should('be.visible');
    });

    it('Cenário 05: Processamento de Dados no Backend', () => {
        cy.intercept('POST', '/register', (req) => {
            // Verificar os dados enviados no corpo da requisição
            expect(req.body).to.have.property('name', 'Test User');
            expect(req.body).to.have.property('email', 'testuser@example.com');
            expect(req.body).to.have.property('password', 'Password123');
            expect(req.body).to.have.property('confirmPassword', 'Password123');

            // Responder com sucesso
            req.reply({
                statusCode: 200,
                body: { message: 'Cadastro realizado com sucesso.' }
            });
        }).as('registerUserBackend');

        cy.get('註冊表單').shadow().find('#姓名').type('Test User');
        cy.get('註冊表單').shadow().find('#電郵').type('testuser@example.com');
        cy.get('註冊表單').shadow().find('#密碼').type('Password123');
        cy.get('註冊表單').shadow().find('#確認密碼').type('Password123');

        cy.get('註冊表單').shadow().find('提交按鈕').shadow().find('button').click();

        cy.wait('@registerUserBackend');

        cy.get('註冊表單').shadow().find('訊息').shadow().find('#訊息').should('contain', 'Cadastro realizado com sucesso.');
    });

    it('Cenário 06: Falha nas Validações do Backend', () => {
        cy.intercept('POST', '/register', {
            statusCode: 400,
            body: { errors: ['電郵已被使用'] }
        }).as('registerUserBackendError');

        cy.get('註冊表單').shadow().find('#姓名').type('Test User');
        cy.get('註冊表單').shadow().find('#電郵').type('existinguser@example.com');
        cy.get('註冊表單').shadow().find('#密碼').type('Password123');
        cy.get('註冊表單').shadow().find('#確認密碼').type('Password123');

        cy.get('註冊表單').shadow().find('提交按鈕').shadow().find('button').click();

        cy.wait('@registerUserBackendError');

        cy.get('註冊表單').shadow().find('訊息').shadow().find('#訊息').should('contain', '電郵已被使用');
    });
});