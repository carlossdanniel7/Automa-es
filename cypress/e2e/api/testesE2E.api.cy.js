import { faker } from "@faker-js/faker";
const { number } = require("assert-plus");
const { method } = require("bluebird");

let valorToken
let url = "http://165.227.93.41/lojinha/v2/"
let produtoId
let usuarioId
let componenteId

describe('Testes E2E de API da Lojinha', () => {
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

        })
    })

    it('Adicionar um produto', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: 5000,
                produtoCores: [
                    "Branca"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente do teste automatizado",
                        componenteQuantidade: 3
                    }
                ]
            }
        }).then((response) => {
            produtoId = response.body.data.produtoId
            componenteId = response.body.data.componentes[0].componenteId
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 5000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branca"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 3).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error").that.is.a("string")

        })
    })
    it('Buscar os produtos do usuário', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.be.an("array")
            response.body.data.forEach((produto => {
                expect(produto).to.have.property("produtoId").that.is.a("number")
                expect(produto).to.have.property("produtoNome").that.is.a("string")
                expect(produto).to.have.property("produtoValor").that.is.a("number")
                expect(produto).to.have.property("produtoCores").that.is.a("array")
                expect(produto).to.have.property("produtoUrlMock").that.is.a("string")
                expect(produto).to.have.property("componentes").that.is.an("array");
                if (produto.componentes.length > 0) {
                    const componente = produto.componentes[0];
                    expect(componente).to.have.property("componenteId").that.is.a("number");
                    expect(componente).to.have.property("componenteNome").that.is.a("string");
                    expect(componente).to.have.property("componenteQuantidade").that.is.a("number")
                }

            }));
            expect(response.body).to.have.property("message", "Listagem de produtos realizada com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
        });
    });

    it('Buscar um dos produtos do usuário', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 5000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branca"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 3).that.is.a("number")
            expect(response.body).to.have.property("message", "Detalhando dados do produto").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });

    });
    it('Alterar as informações de um produto', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: 1550,
                produtoCores: [
                    "Azul"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "resistor",
                        componenteQuantidade: 4
                    }
                ]
            }
        }).then((response) => {
            const data = response.body.data;
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 1550).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores", "Azul").that.is.a("string")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")

        })
    });
    it('Adicionar um novo componente ao produto', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "fone celular",
                componenteQuantidade: 14
            }
        }).then((response) => {
            componenteId = response.body.data.componenteId
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "fone celular").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 14).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });
    it('Buscar dados dos componentes de um produto', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            const componentes = response.body.data;
            expect(response.status).to.eq(200);
            expect(componentes).to.be.an("array").that.has.length.greaterThan(1);
            componentes.forEach((componente) => {
            expect(componente).to.have.property("componenteId").that.is.a("number");
            expect(componente).to.have.property("componenteNome").that.is.a("string");
            expect(componente).to.have.property("componenteQuantidade").that.is.a("number");
            });
            expect(response.body).to.have.property("message", "Listagem de componentes de produto realizada com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
        });
    });
    it('Buscar um componente de produto', () => {
        cy.api({
            method: "GET",
            url:`${url}produtos/${produtoId}/componentes/${componenteId}`,
            headers:{
                token: valorToken
            },
        }).then((response) => {
           expect(response.status).to.eq(200)
           expect(response.body.data).to.have.property("componenteId").that.is.a("number")
           expect(response.body.data).to.have.property("componenteNome").that.is.a("string")
           expect(response.body.data).to.have.property("componenteQuantidade").that.is.a("number")
           expect(response.body).to.have.property("message","Detalhando dados do componente de produto").that.is.a("string")
           expect(response.body).to.have.property("error", "").that.is.a("string")

        })
    });
    it('Alterar informações de um componente de produto', () =>{
        cy.api({
            method: ("PUT"),
            url:`${url}produtos/${produtoId}/componentes/${componenteId}`,
            headers: {
                token: valorToken
            },
            body:{
                componenteNome: "foninho",
                componenteQuantidade: 2
              }
        }).then((response) => {
           expect(response.status).to.eq(200)
           expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
           expect(response.body.data).to.have.property("componenteNome", "foninho").that.is.a("string")
           expect(response.body.data).to.have.property("componenteQuantidade", 2).that.is.a("number")
           expect(response.body).to.have.property("message", "Componente de produto alterado com sucesso")
        })
    })
    it(`Remover um componente do produto ${componenteId}`, () => {
        cy.api({
            method: "DELETE",
            url:`${url}produtos/${produtoId}/componentes/${componenteId}`,
            headers:{
                token: valorToken
            },

        }).then((response) =>{
            expect(response.status).to.eq(204)
        })
    })
    after(`Remover o produto ${produtoId}`, () => {
        cy.api({
            method: "DELETE",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(204)
        })
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







