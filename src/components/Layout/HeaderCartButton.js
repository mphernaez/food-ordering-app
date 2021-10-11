import { useContext, useEffect, useState } from "react";

import CartIcon from "../Cart/CartIcon";
import CartContext from "../../store/cart-context";

import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const [btnAnimation, setBtnAnimation] = useState(false);
  const cartCtx = useContext(CartContext);

  const cartItemsCount = cartCtx.items.reduce((currentNumber, item) => {
    return currentNumber + item.amount;
  }, 0); // adds amount o each item to previouse total

  const btnClasses = `${classes.button} ${btnAnimation ? classes.bump : " "}`;

  useEffect(() => {
    if (cartCtx.items.length == 0) {
      setBtnAnimation(false);
      return;
    }
    setBtnAnimation(true);

    const timer = setTimeout(() => setBtnAnimation(false), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [cartCtx]);

  return (
    <button className={btnClasses} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span> Your Cart </span>
      <span className={classes.badge}> {cartItemsCount} </span>
    </button>
  );
};

export default HeaderCartButton;
