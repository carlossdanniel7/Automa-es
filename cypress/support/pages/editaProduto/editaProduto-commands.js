Cypress.Commands.add("editarProduto", (nomeeditarProduto, valoreditarProduto, coreditarProduto) => {
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
    cy.get('#logo-container').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('h3').contains('Lista de Produtos').should('be.visible')
    cy.get('.collection li .title a').contains('Celular Samsung').should('be.visible').first().click();
    cy.url('contains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    //Editar Produto    
    cy.get('.active').eq(0).should('be.visible').and('have.text', 'Nome do Produto')
    cy.get('#produtonome').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (nomeeditarProduto === '') {
        cy.get('#produtonome').clear()
    } else {
        cy.get('#produtonome').clear().type(nomeeditarProduto)
    }
    // Valor do Produto
    cy.get('.active').eq(1).should('be.visible').and('have.text', 'Valor do Produto')
    cy.get('#produtovalor').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (valoreditarProduto === '') {
        cy.get('#produtovalor').clear()
    } else {
        cy.get('#produtovalor').clear().type(valoreditarProduto)
    }
    // Cores do Produto
    cy.get('.active').eq(2).should('be.visible').and('have.text', 'Cores do Produto (Separadas por Vírgula)')
    cy.get('#produtocores').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (coreditarProduto === '') {
        cy.get('#produtocores').clear()
    } else {
        cy.get('#produtocores').clear().type(coreditarProduto)
    }
    // Salvar o Produto Editado
    cy.get('.waves-effect').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')


})