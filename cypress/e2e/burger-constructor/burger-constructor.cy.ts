describe('Burger Constructor', () => {
  beforeEach(() => {
    // Моки для всех API endpoints
    cy.intercept('GET', '**/api/ingredients**', (req) => {
      req.reply({ fixture: 'ingredients.json' });
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user**', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders**', {
      fixture: 'order.json'
    }).as('createOrder');

    // Устанавливаем токены авторизации
    cy.setCookie('accessToken', 'test-token');

    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should('exist');
  });

  afterEach(() => {
    // Очищаем после теста
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  describe('Adding Ingredients to Constructor', () => {
    it('should add bun to constructor', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что булка добавилась
      cy.get('[data-cy="constructor-area"]')
        .contains('Краторная булка N-200i (верх)')
        .should('exist');

      cy.get('[data-cy="constructor-area"]')
        .contains('Краторная булка N-200i (низ)')
        .should('exist');
    });

    it('should add main ingredient to constructor', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем что начинка добавилась
      cy.get('[data-cy="constructor-area"]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });
  });

  describe('Modal Windows', () => {
    it('should open ingredient details modal', () => {
      // Кликаем на ингредиент чтобы открыть модальное окно
      cy.contains('Краторная булка N-200i').click();

      // Проверяем что модальное окно открылось по data-cy
      cy.get('[data-cy="modal"]').should('exist');
      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Краторная булка N-200i').should('exist');
    });

    it('should close modal by close button', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').should('exist');

      // Закрываем по крестику через data-cy
      cy.get('[data-cy="modal-close"]').click();

      // Проверяем что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('should close modal by overlay click', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').should('exist');

      // Кликаем на оверлей через data-cy
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Order Creation', () => {
    it('should create order successfully', () => {
      // Собираем бургер - добавляем булку и начинку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Вызываем клик по кнопке «Оформить заказ»
      cy.get('[data-cy="order-button"]').click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('exist');

      // Проверяем что номер заказа верный через data-cy
      cy.get('[data-cy="order-number"]').should('contain', '12345');

      // Закрываем модальное окно по крестику
      cy.get('[data-cy="modal-close"]').click();

      // Проверяется успешность закрытия
      cy.get('[data-cy="modal"]').should('not.exist');

      // Проверяется, что конструктор пуст
      cy.get('[data-cy="constructor-area"]')
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');
    });
  });
});
