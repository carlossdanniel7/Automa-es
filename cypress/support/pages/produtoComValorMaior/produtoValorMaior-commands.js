Cypress.Commands.add("produtoValorMaior", (nomeProdutomaior, valorProdutomaior, corProdutomaior) => {
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
    cy.get('#logo-container').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('h3').contains('Lista de Produtos').should('be.visible')
    cy.get('.waves-effect.waves-light.btn.right').should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').and('have.text', 'Adicionar produto').click()
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto/novo')
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('h4').should('be.visible').and('have.text', 'Adicionar produto')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    // Nome do Produto
    cy.get('.active').eq(0).should('be.visible').and('have.text', 'Nome do Produto')
    cy.get('#produtonome').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (nomeProdutomaior === '') {
        cy.get('#produtonome').clear()
    } else {
        cy.get('#produtonome').type(nomeProdutomaior)
    }
    // Valor do Produto
    cy.get('.active').eq(1).should('be.visible').and('have.text', 'Valor do Produto')
    cy.get('#produtovalor').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (valorProdutomaior === '') {
        cy.get('#produtovalor').clear()
    } else {
        cy.get('#produtovalor').type(valorProdutomaior)
    }
    // Cores do Produto
    cy.get('.active').eq(2).should('be.visible').and('have.text', 'Cores do Produto (Separadas por Vírgula)')
    cy.get('#produtocores').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (corProdutomaior === '') {
        cy.get('#produtocores').clear()
    } else {
        cy.get('#produtocores').type(corProdutomaior)
    }
    // Salvar o Produto
    cy.get('#btn-salvar').should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')
    cy.url('constains','http://165.227.93.41/lojinha-web/v2/produto?error')
    
})