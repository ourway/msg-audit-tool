const baseUrl = Cypress.config().baseUrl;

function addAudit(testAudit) {
  //cy.visit(baseUrl + '/audits/new');
  cy.get('[data-cy=home]');
  cy.get('[data-cy=new-audit]').click();
  inputAudit(testAudit);
}

function inputAudit(testAudit) {
  cy.on('uncaught:exception', (err, runnable) => {
    expect(err.message).to.include('nebular issue: https://github.com/akveo/nebular/issues/2338');
    done();
    return false;
  });
  // Input Audit name, start date, end date and open next collapsed accordeon through click
  cy.get('[data-cy=audit-basic-data-form]').should('exist');
  cy.get('[data-cy=audit-name-input]').clear().type(testAudit.name);
  if (testAudit.start) {
    cy.get('[data-cy=audit-start-input]').click();
    cy.get('.today > .cell-content').click();
  }
  if (testAudit.end) {
    cy.get('[data-cy=audit-end-input]').click();
    cy.get('.today > .cell-content').click();
  }
  cy.get('[data-cy=audit-basic-data-form]').click();
  // Input Customer data and open next collapsed accordeon through click
  if (testAudit.customerData) {
    cy.get('[data-cy=audit-customer-data-form]').click();
    if (testAudit.customerData.name) {
      cy.get('[data-cy=audit-customer-name-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.customerData.name);
    }
    if (testAudit.customerData.department) {
      cy.get('[data-cy=audit-customer-department-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.customerData.department);
    }
    if (testAudit.customerData.corporateDivision) {
      cy.get('[data-cy=audit-customer-division-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.customerData.corporateDivision);
    }
    if (testAudit.customerData.sector) {
      cy.get('[data-cy=audit-customer-sector-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.customerData.sector);
    }
    cy.get('[data-cy=audit-customer-data-form]').click();
  }

  if (testAudit.contactPerson) {
    cy.get('[data-cy=audit-contact-data-form]').click();

    // Input Contact Information and open next collapsed accordeon through click
    cy.get(':nth-child(1) > .appearance-outline > .select-button').click();
    if (testAudit.contactPerson.title) {
      cy.get('[data-cy=salutation-option]').contains(testAudit.contactPerson.title).click();
    }
    if (testAudit.contactPerson.salutation) {
      cy.get('[data-cy=audit-contact-title-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.contactPerson.salutation);
    }
    if (testAudit.contactPerson.firstName) {
      cy.get('[data-cy=audit-contact-firstname-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.contactPerson.firstName);
    }
    if (testAudit.contactPerson.lastName) {
      cy.get('[data-cy=audit-contact-lastname-input]')
        .filter(':visible')
        .clear()
        .type(testAudit.contactPerson.lastName);
    }
    if (testAudit.contactPerson.information) {
      cy.get('[data-cy=audit-contact-info-input]')
        .clear()
        .type(testAudit.contactPerson.information);
    }
  }
  cy.get('[data-cy=submit-audit-data-form]').click();
}

function testAuditInfoPage(testAudit) {
  cy.get('[data-cy=audit-name]').should('contain.text', testAudit.name);
  if (!testAudit.end) {
    cy.get('[data-cy=audit-timeframe]').contains('TBD');
  }
  cy.get('[data-cy=audit-customer-name]').should('contain.text', testAudit.customerData.name);
  cy.get('[data-cy=audit-customer-department]').should(
    'contain.text',
    testAudit.customerData.department,
  );
  cy.get('[data-cy=audit-customer-division]').should(
    'contain.text',
    testAudit.customerData.corporateDivision,
  );
  cy.get('[data-cy=audit-customer-sector]').should('contain.text', testAudit.customerData.sector);
  cy.get('[data-cy=audit-contact-person]').should(
    'contain.text',
    testAudit.contactPerson.firstName,
  );
  cy.get('[data-cy=audit-contact-person]').should('contain.text', testAudit.contactPerson.lastName);
  cy.get('[data-cy=audit-contact-person]').should(
    'contain.text',
    testAudit.contactPerson.salutation,
  );
  cy.get('[data-cy=audit-contact-person]').should('contain.text', testAudit.contactPerson.title);
  cy.get('[data-cy=audit-contact-info]').should(
    'contain.text',
    testAudit.contactPerson.information,
  );
}

function testAuditListEntry(testAudit) {
  cy.get('[data-cy=audit-short-infos]').first().should('contain.text', testAudit.name);
  if (!testAudit.end) {
    cy.get('[data-cy=audit-short-infos]').contains('TBD');
  }
  // A newly added audit always has the status 'Planned'
  cy.get('[data-cy=audit-status]').first().should('have.attr', 'nbPopover');
  cy.get('[data-cy=audit-status]').first().invoke('attr', 'nbPopover').should('contain', 'Geplant');
}

// TODO testAlertDialog
// it('Clicking yes on warning message should close overlay', () => {
//     cy.get('[data-cy=discard]').click();
//     cy.get('[data-cy=discard-back-dialog]').should('not.exist');
//   });

Cypress.Commands.add('addAudit', addAudit);
Cypress.Commands.add('inputAudit', inputAudit);
Cypress.Commands.add('testAuditInfoPage', testAuditInfoPage);
Cypress.Commands.add('testAuditListEntry', testAuditListEntry);
