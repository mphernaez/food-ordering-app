import { useReducer } from "react";

import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD_ITEM") {
    const updatedTotalAmount =
      state.totalAmount + action.item.amount * action.item.price;

    const exitingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[exitingCartItemIndex];
    let updatedItem;
    let updatedItems;

    if (existingCartItem) {
      updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[exitingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  } else if (action.type === "REMOVE_ITEM") {
    const updatedTotalAmount =
      state.totalAmount - action.item.amount * action.item.price;

    const exitingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[exitingCartItemIndex];

    let updatedItem;
    let updatedItems;

    if (existingCartItem) {
      if (existingCartItem.amount <= action.item.amount) {
        updatedItems = [...state.items].filter(
          (item) => item != existingCartItem
        );
      } else if (existingCartItem.amount > action.item.amount) {
        updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount - action.item.amount,
        };
        updatedItems = [...state.items];
        updatedItems[exitingCartItemIndex] = updatedItem;
      }
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  } else if (action.type === "CLEAR") {
    return defaultCartState;
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  };
  const removetItemFromCartHandler = (item) => {
    dispatchCartAction({ type: "REMOVE_ITEM", item: item });
  };

  const clearCartHandler = (item) => {
    dispatchCartAction({ type: "CLEAR" });
  };
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removetItemFromCartHandler,
    clearItems: clearCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
