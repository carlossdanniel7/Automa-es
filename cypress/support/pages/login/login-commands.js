Cypress.Commands.add("login", (usuario, senha) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/")
    cy.get('#usuario').should('be.visible').type(usuario,{force: true})
    cy.get('#senha').should('be.visible').type(senha,{force: true})
    cy.get('#btn-entrar')
        .should('be.visible')
        .and('have.css', 'background-color', 'rgb(38, 166, 154)')
        .click()
        
})

