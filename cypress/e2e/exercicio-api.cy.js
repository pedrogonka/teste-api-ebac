/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = 'fulano' + Math.floor(Math.random() * 100000) + '@qa.com.br';
    cy.cadastrarUsuario('fulano da silva', email, 'teste')
      .should((response) => {
        expect(response.status).equal(201);
        expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      });
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('fulano da silva', 'fulano@qa.com.br', 'teste')
      .should((response) => {
        expect(response.status).equal(400)
        expect(response.body.message).to.equal('Este email já está sendo usado')

      });
  });



  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = 'Usuario EBAC' + Math.floor(Math.random() * 100000);
    let email = 'fulano' + Math.floor(Math.random() * 100000) + "@qa.com.br";

    cy.cadastrarUsuario(nome, email, 'teste')
      .then(response => {
        return cy.editarUsuario(response.body._id, 'Usuario EBAC Editado', 'editado' + Math.floor(Math.random() * 100000) + '@ebac.com.br', 'nova_senha');
      })
      .should(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso');
        expect(response.status).to.equal(200);
      });
  });



  it.only('Deve deletar um usuário previamente cadastrado', () => {
    let nome = 'Usuario EBAC' + Math.floor(Math.random() * 100000);
    let email = 'fulano' + Math.floor(Math.random() * 100000) + "@qa.com.br";

    cy.cadastrarUsuario(nome, email, 'teste')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'Delete',
          url: `usuarios/${id}`,
        }).should(resp => {
          expect(resp.body.message).to.equal('Registro excluído com sucesso')
          expect(resp.status).to.equal(200)

        })
      });
  });
});
