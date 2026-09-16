import { useEffect, useState } from "react";
import "./index.css";
import AdminDashboard from "./AdminDashboard";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002";
function App() {
  const [showLogin, setShowLogin] = useState(false);
    const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(
    !!localStorage.getItem("adminToken")
  );

  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");

    try {
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
  `${API_URL}/api/products`
);
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

      loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };
const increaseQuantity = (productId) => {
  setCart((currentCart) =>
    currentCart.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    )
  );
};

const decreaseQuantity = (productId) => {
  setCart((currentCart) =>
    currentCart
      .map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};

const removeFromCart = (productId) => {
  setCart((currentCart) =>
    currentCart.filter((item) => item.id !== productId)
  );
};
  const handleAdminLogin = async (e) => {
    e.preventDefault();


    setLoading(true);
    setLoginMessage("");

    try {
    const response = await fetch(
  `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginMessage(
          data.message || "Invalid admin credentials"
        );
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      setAdmin(data.admin);
      setIsAdmin(true);

      setShowLogin(false);
      setEmail("");
      setPassword("");
      setLoginMessage("");

      alert("Admin login successful!");
    } catch (error) {
      setLoginMessage(
        "Server-এর সাথে connection হচ্ছে না। Backend চালু আছে কিনা দেখুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    setAdmin(null);
    setIsAdmin(false);

    alert("Admin logged out successfully!");
  };

  // Admin Dashboard
  if (isAdmin) {
    return (
      <AdminDashboard
        admin={admin}
        onLogout={handleLogout}
      />
    );
  }
if (showCart) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>

<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <button onClick={() => decreaseQuantity(item.id)}>
    −
  </button>

  <span>{item.quantity}</span>

  <button onClick={() => increaseQuantity(item.id)}>
    +
  </button>
</div>

<p>Price: ৳{item.price}</p>
<button
  onClick={() => removeFromCart(item.id)}
  style={{
    marginTop: "10px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    background: "#d32f2f",
    color: "#fff",
    cursor: "pointer",
  }}
>
  Remove
</button>
<p style={{ fontWeight: "700", fontSize: "20px" }}>
  Total: ৳{item.price * item.quantity}
</p>
          </div>
        ))
      )}
<p style={{ fontWeight: "700", fontSize: "24px" }}>
  Grand Total: ৳
  {cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )}
</p>
      <button onClick={() => setShowCart(false)}>
        ← Continue Shopping
      </button>
    </div>
  );
}
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          The Craft Hub
        </div>

        <nav>
          <a href="#">Home</a>
          <a href="#">Shop</a>
          <a href="#">Categories</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        <div className="nav-actions">
          <button>🔍</button>
          <button onClick={() => setShowCart(true)}>
  🛒 {cart.length}
</button>

          <button onClick={() => setShowLogin(true)}>
            👤 Login
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-small">
              WELCOME TO THE CRAFT HUB
            </p>

            <h1>
              Beautiful Crafts,
              <br />
              Made With Love
            </h1>

            <p className="hero-text">
              Discover unique handmade products crafted with
              creativity, care and passion.
            </p>

            <button className="shop-button">
              Shop Now →
            </button>
          </div>
        </section>

        <section className="categories">
          <h2>Shop By Category</h2>

          <div className="category-grid">
            <div className="category-card">
              <div className="category-icon">🎨</div>
              <h3>Handmade Crafts</h3>
              <p>Creative handmade items</p>
            </div>

            <div className="category-card">
              <div className="category-icon">👜</div>
              <h3>Fashion & Bags</h3>
              <p>Beautiful lifestyle products</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🏠</div>
              <h3>Home Decor</h3>
              <p>Make your home beautiful</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🎁</div>
              <h3>Gift Items</h3>
              <p>Perfect gifts for everyone</p>
            </div>
          </div>
        </section>
        <section
  style={{
    padding: "60px 30px",
    background: "#fff",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        marginBottom: "10px",
      }}
    >
      Our Products
    </h2>

    <p
      style={{
        textAlign: "center",
        color: "#777",
        marginBottom: "35px",
      }}
    >
      Discover our handmade products
    </p>

    {productsLoading ? (
      <p style={{ textAlign: "center" }}>
        Loading products...
      </p>
    ) : products.length === 0 ? (
      <p style={{ textAlign: "center", color: "#777" }}>
        No products available yet.
      </p>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "#fff",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  height: "220px",
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "55px",
                }}
              >
                📦
              </div>
            )}

            <div style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 8px" }}>
                {product.name}
              </h3>

              <p
                style={{
                  color: "#777",
                  margin: "0 0 10px",
                }}
              >
                {product.category || "Uncategorized"}
              </p>

              <p
                style={{
                  color: "#666",
                  minHeight: "40px",
                }}
              >
                {product.description}
              </p>

              <strong style={{ fontSize: "20px" }}>
                ৳{Number(product.price).toLocaleString()}
              </strong>

              <p
                style={{
                  color: "#666",
                  marginTop: "8px",
                }}
              >
                Stock: {product.stock}
              </p>

              <button
              onClick={() => handleAddToCart(product)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#222",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>
      </main>

      {showLogin && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#fff",
              borderRadius: "18px",
              padding: "30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => {
                setShowLogin(false);
                setLoginMessage("");
              }}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "transparent",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h2
              style={{
                marginBottom: "8px",
                color: "#222",
              }}
            >
              Admin Login
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: "25px",
              }}
            >
              Login to access The Craft Hub admin panel.
            </p>

            <form onSubmit={handleAdminLogin}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  marginBottom: "18px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  marginBottom: "18px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />

              {loginMessage && (
                <p
                  style={{
                    color: "#d32f2f",
                    background: "#ffebee",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  {loginMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#222",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;