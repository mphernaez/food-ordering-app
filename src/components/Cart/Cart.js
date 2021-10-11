import React, { useContext, useState } from "react";

import Card from "../UI/Card";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

import classes from "./Cart.module.css";

const Cart = (props) => {
  const [order, setOrder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (item) => {
    cartCtx.removeItem({
      id: item.id,
      name: item.name,
      amount: 1,
      price: item.price,
    });
  };
  const cartItemAddHandler = (item) => {
    cartCtx.addItem({
      id: item.id,
      name: item.name,
      amount: 1,
      price: item.price,
    });
  };
  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderHandler = () => {
    setOrder(true);
  };

  const closeOrderHandler = () => {
    setOrder(false);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onHideCart}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://foodordering-react-612dc-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({ user: userData, orderedItems: cartCtx.items }),
      }
    );

    setIsSubmitting(false);

    setDidSubmit(true);

    cartCtx.clearItems();
  };

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {order && (
        <Checkout onClose={closeOrderHandler} onSubmit={submitOrderHandler} />
      )}
      {!order && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data</p>;
  const didSubmitModalContent = <p>Successfully sent order</p>;

  return (
    <Modal onClick={props.onHideCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && !didSubmit && isSubmittingModalContent}
      {didSubmit && !isSubmitting && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
