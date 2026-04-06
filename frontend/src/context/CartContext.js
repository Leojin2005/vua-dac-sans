import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i._id === product._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += qty;
        return updated;
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, image: product.image, stock: product.stock, quantity: qty }];
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i)));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
