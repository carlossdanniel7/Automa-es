import { faker } from "@faker-js/faker";
const { number } = require("assert-plus");
const { method } = require("bluebird");

let valorToken
let url = "http://165.227.93.41/lojinha/v2/"
let usuarioId


describe('Testes Usuario de API da Lojinha', () => {
    it('Obter token do usuario', () => {
        cy.api({
            method: "POST",
            url: `${url}login`,
            body: {
                usuarioLogin: "carlos2025",
                usuarioSenha: "carlos2025"
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            valorToken = response.body.data.token
            expect(response.body).to.have.property("message", "Sucesso ao realizar o login")
            expect(response.body).to.have.property("error", "")

        })
    })
    it('Adicionar um novo usuario', () => {
        const usuarioNome = faker.person.firstName();
        const usuarioLogin = faker.internet.username();
        const usuarioSenha = faker.internet.password();
        cy.api({
            method: "POST",
            url: `${url}usuarios`,
            body: {
                usuarioNome: usuarioNome,
                usuarioLogin: usuarioLogin,
                usuarioSenha: usuarioSenha
            }

        }).then((response) => {
            usuarioId = response.body.data.usuarioId
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("usuarioId", usuarioId);
            expect(response.body.data).to.have.property("usuarioNome", usuarioNome);
            expect(response.body.data).to.have.property("usuarioLogin", usuarioLogin);
            expect(response.body).to.have.property("message", "Usuário adicionado com sucesso");
            expect(response.body).to.have.property("error", "").that.is.a("string");

        });
    });
    it('Obter token do usuario, incorreto', () => {
        cy.api({
            method: "POST",
            url:`${url}/usuarios`,
            body:{
                usuarioLogin: "carlos2025",
                usuarioSenha: "carlos20252"
              },
              failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    })
    it('Adicionar um novo usuario, com caracateres especiais', () => {
        const usuarioNome = faker.person.firstName();
        const usuarioLogin = faker.internet.username();
        const usuarioSenhaBase = faker.internet.password(8); 
        const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?/~`";
        const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)]; 
        const usuarioSenha = usuarioSenhaBase + randomSpecial;
        cy.api({
            method: "POST",
            url: `${url}usuarios`,
            body: {
                usuarioNome: usuarioNome,
                usuarioLogin: usuarioLogin,
                usuarioSenha: usuarioSenha
            },
            failOnStatusCode: false

        }).then((response) => {
            expect(response.status).to.eq(201)
        });
    });
    it('Adicionar um novo usuario, com os campos em branco', () => {
        cy.api({
            method: "POST",
            url: `${url}usuarios`,
            body: {
                usuarioNome: "",
                usuarioLogin: "",
                usuarioSenha: ""
            },
            failOnStatusCode: false

        }).then((response) => {
            usuarioId = response.body.data.usuarioId
            expect(response.status).to.eq(409)
            expect(response.body).to.have.property("message", "Usuário adicionado com sucesso");
            expect(response.body).to.have.property("error", "").that.is.a("string");

        });
    });

after('Limpas todos os dados do usuario', () => {
        cy.api({
            method: "DELETE",
            url: `${url}dados`,
            headers: {
                token: valorToken
            }

        }).then((response) => {
            expect(response.status).to.eq(204)

        })
    });
});
