import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import { Collections } from './pages/Collections';
import { SidebarCart } from './components/SidebarCart';
import { MobileGate } from './components/MobileGate';
import { addItem, updateItem, clearItems } from './cartUtils';

const App = () => {
  // Shared Cart States
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const isCurrentlyEmpty = Object.keys(prev).length === 0;
      if (isCurrentlyEmpty) setIsCartOpen(true);
      return addItem(prev, id);
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => updateItem(prev, id, delta));
  };

  const clearCart = () => {
    setCart(clearItems());
  };

  return (
    <BrowserRouter>
      {/* Mobile blocker - hidden on screen >= md/lg */}
      <MobileGate />

      {/* Page Routing */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              addToCart={addToCart}
              updateQty={updateQty}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/collections"
          element={
            <Collections
              cart={cart}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              addToCart={addToCart}
            />
          }
        />
      </Routes>

      {/* Global Checkout/Cart drawer overlay */}
      <SidebarCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        clearCart={clearCart}
      />
    </BrowserRouter>
  );
};

export default App;