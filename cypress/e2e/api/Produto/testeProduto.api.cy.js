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
    it('Adicionar um produto, sem nome', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "",
                produtoValor: 552,
                produtoCores: [
                    "Preto"
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

        })
    })
    it('Adicionar um produto, sem cor', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Papelão",
                produtoValor: 52,
                produtoCores: [
                    ""
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


        })
    })
    it('Adicionar um produto, sem valor', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Papel",
                produtoValor: "",
                produtoCores: [
                    "azul"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente do teste automatizado",
                        componenteQuantidade: 3
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422

            )

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
            expect(response.body.data).to.have.property("produtoNome", "Papelão").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 52).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal([""]).that.is.a("array")
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
    it('Alterar as informações de um produto, deixando ele sem nome', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "",
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
            expect(response.body.data).to.have.property("produtoNome", "").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 1550).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores", "Azul").that.is.a("string")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")

        })
    });
    it('Alterar as informações de um produto, deixando ele sem valor', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "teste",
                produtoValor: "",
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
            },
            failOnStatusCode: false
        }).then((response) => {
            const data = response.body.data;
            expect(response.status).to.eq(422)

        })
    });
    it('Alterar as informações de um produto, deixando ele sem cor', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Bolinha de Golfe",
                produtoValor: "",
                produtoCores: [
                    ""
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "bolinha de golfe reserva",
                        componenteQuantidade: 4
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
        })
    });
    it('Alterar as informações de um produto, colocando 100 caracteres no nome.', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Bolinha de Golfe Bolinha de Golfe Bolinha de Golfe Bolinha de Golfe Bolinha de Golfe Bolinha de Golfe",
                produtoValor: 15,
                produtoCores: [
                    "Laranja"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "bolinha de golfe reserva",
                        componenteQuantidade: 10
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    });
    it(`Remover o produto ${produtoId}`, () => {
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
});