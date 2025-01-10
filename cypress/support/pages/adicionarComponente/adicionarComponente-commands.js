Cypress.Commands.add("adicionarComponente", (nomeComponente, quantidadeComponenteProduto) => {
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto') 
    cy.get('#logo-container').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('h3').contains('Lista de Produtos').should('be.visible')
    cy.get('.collection li .title a').contains('Celular Samsung').should('be.visible').first().click();
    cy.url('contains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    // Adiconar Componente
    cy.get('.waves-effect').eq(2).should('be.visible').and('have.css', 'background-color','rgb(233, 30, 99)').click()
    cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
    // Nome do Componente Adicionado ao Produto
    cy.get('#componentenomeadicionar').eq(0).should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (nomeComponente === '') {
        cy.get('#componentenomeadicionar').clear()
    } else {
        cy.get('#componentenomeadicionar').type(nomeComponente)
    }
    //Quantidade do Componente de Produto
    cy.get('#componentequantidadeadicionar').eq(0).should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (quantidadeComponenteProduto === '') {
        cy.get('#componentequantidadeadicionar').clear()
    } else {
        cy.get('#componentequantidadeadicionar').type(quantidadeComponenteProduto)
    }
    //Salvar Componente
    cy.get('.waves-effect').eq(3).should('be.visible').and('have.css', 'background-color','rgb(38, 166, 154)').click()
})