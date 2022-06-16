import React from 'react';
import { Link } from 'react-router-dom';

export const CartEmpty: React.FC = () => {
  return (
    <div className="cart cart--empty">
      <h2>
        Корзина пустая <span>😕</span>
      </h2>
      <p>
        Вероятней всего, вы не заказывали ещё пиццу.
        <br />
        Для того, чтобы заказать пиццу, перейди на главную страницу.
      </p>
      <img src="./img/empty-cart.png" alt="Empty cart" />
      <Link to="/pizza-react" className="button button--black">
        <span>Вернуться назад</span>
      </Link>
    </div>
  );
};
