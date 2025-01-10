const { faker } = require("@faker-js/faker");
const { min } = require("lodash");

const usuario = Cypress.env("username")
const senha = Cypress.env("password")
describe('Lista de Produto', () => {
   beforeEach(() => {
      cy.login(usuario, senha)
      cy.url().should('eq', "http://165.227.93.41/lojinha-web/v2/produto")
      
   });
   it.only('Criar um produto com sucesso', () => {
      cy.novoProduto('Celular iphone', '7000.00', 'Preto, Branco')
      cy.get('#btn-salvar').click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto')
      
   });
   it.only('Criar um Produto sem Nome', () =>{
      cy.novoProduto('','140.00','Violetas')
      cy.get('#btn-salvar').click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto')
      

   })
   it.only('Excluir Produto', () => {
      cy.get('.secondary-content').eq(0).click()
      
   })
   it.only('Criar um produto com valor maior que o permitido', () => {
      cy.produtoValorMaior('Garrafa de suco', '8000.00', 'Preto, Branco')
      cy.get('#btn-salvar').click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto?error')
      
      
   })
   it.only('Criar um Produto sem valor', () =>{
   cy.produtoValorMaior('Garrafa de suco','', 'Preto, Branco')
      cy.get('#btn-salvar').click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto?error')
     
   })
   it.only('Criar um Produto sem Cor', () =>{
      cy.produtoValorMaior('Garrafa de suco','150.00','')
         cy.get('#btn-salvar').click()
         cy.url('http://165.227.93.41/lojinha-web/v2/produto/editar')
         cy.screenshot()
      })
   it.only('Editar Produtro com Sucesso', () => {
      cy.editarProduto('Celular Samsung', '78.00', 'Azul, claro')
      cy.get('.waves-effect').eq(0).click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto/editar')
      cy.get('.waves-effect').eq(1).click()
      cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
      
   })
   it.only('Adicionar Componente com Sucesso', () => {
      cy.adicionarComponente('Fone de Ouvido', '10')
      cy.get('.waves-effect').eq(0).click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto/editar')
      
   })
   it.only('Excluir componente', () => {
      cy.editarProduto('Celular Samsung', '78.00', 'Azul, claro')
      cy.get('.secondary-content').eq(0).click()
      cy.url('http://165.227.93.41/lojinha-web/v2/produto/editar')
      
   })
});
describe('Login inválido', () => {
   it.only('Login com credencias inválidas', () => {
      cy.login(faker.person.firstName(), faker.internet.password())
      cy.url('contains', 'http://165.227.93.41/lojinha-web/v2/')
      
   })
   it.only('Login com credencias com caracteres especiais', () => {
      cy.login('@@@@@@','!!!!!!!')
      cy.url('contains', 'http://165.227.93.41/lojinha-web/v2/?error')
      
   })
});
