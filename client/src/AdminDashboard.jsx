import { useEffect, useState } from "react";
function AdminDashboard({ admin, onLogout }) {

  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image_url: "",
  });

  const loadProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5002/api/products"
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5002/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add product");
        return;
      }

      setMessage("Product added successfully! ✅");

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image_url: "",
      });

      setShowForm(false);

      await loadProducts();
    } catch (error) {
      setMessage("Server-এর সাথে connection হচ্ছে না।");
    } finally {
      setLoading(false);
    }
  };
const handleEditProduct = (product) => {
  setEditingProduct(product);

  setForm({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    category: product.category || "",
    image_url: product.image_url || "",
  });

  setShowForm(true);
  setMessage("");
};
  const handleDeleteProduct = async (id) => {const handleAddProduct = async (e) => {
  e.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    const url = editingProduct
      ? `http://localhost:5002/api/products/${editingProduct.id}`
      : "http://localhost:5002/api/products";

    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(
        data.message ||
          (editingProduct
            ? "Failed to update product"
            : "Failed to add product")
      );
      return;
    }

    setMessage(
      editingProduct
        ? "Product updated successfully! ✅"
        : "Product added successfully! ✅"
    );

    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image_url: "",
    });

    setEditingProduct(null);
    setShowForm(false);

    await loadProducts();
  } catch (error) {
    setMessage("Server-এর সাথে connection হচ্ছে না।");
  } finally {
    setLoading(false);
  }
};
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5002/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        await loadProducts();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      alert("Server-এর সাথে connection হচ্ছে না।");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#222",
          color: "#fff",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>The Craft Hub</h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#bbb",
            }}
          >
            Admin Dashboard
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
            color: "#222",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: "35px" }}>
        <h1 style={{ marginBottom: "8px" }}>
          Welcome, {admin?.name || "Admin"} 👋
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Manage your The Craft Hub store from here.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div className="admin-stat-card">
            <h3>Products</h3>

            <p>{products.length}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Orders</h3>

            <p>0</p>
          </div>

          <div className="admin-stat-card">
            <h3>Customers</h3>

            <p>0</p>
          </div>

          <div className="admin-stat-card">
            <h3>Revenue</h3>

            <p>৳0</p>
          </div>
        </div>

        {/* Products */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Products</h2>

            <p
              style={{
                margin: "5px 0",
                color: "#777",
              }}
            >
              Add and manage your store products.
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setMessage("");
            }}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#222",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {showForm ? "Close Form" : "+ Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "30px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Add New Product
            </h2>

            <form onSubmit={handleAddProduct}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <label>Product Name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product name"
                    required
                  />
                </div>

                <div>
                  <label>Category</label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Example: Handmade Crafts"
                  />
                </div>

                <div>
                  <label>Price (৳)</label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="500"
                    required
                  />
                </div>

                <div>
                  <label>Stock</label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Image URL</label>

                  <input
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    rows="5"
                  />
                </div>
              </div>

              {message && (
                <p
                  style={{
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "12px",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "20px",
                  padding: "13px 25px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#222",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
               {loading
  ? editingProduct
    ? "Updating..."
    : "Saving..."
  : editingProduct
    ? "Update Product"
    : "Save Product"}
              </button>
            </form>
          </div>
        )}

        {/* Product List */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
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
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "200px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "50px",
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

                <strong
                  style={{
                    fontSize: "20px",
                  }}
                >
                  ৳{Number(product.price).toLocaleString()}
                </strong>

                <p
                  style={{
                    color: "#666",
                    margin: "8px 0 15px",
                  }}
                >
                  Stock: {product.stock}
                </p>
<button
  onClick={() => handleEditProduct(product)}
  style={{
    padding: "9px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Edit
</button>
                <button
                  onClick={() =>
                    handleDeleteProduct(product.id)
                  }
                  style={{
                    padding: "9px 15px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#d32f2f",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !showForm && (
          <div
            style={{
              background: "#fff",
              padding: "50px",
              textAlign: "center",
              borderRadius: "15px",
              color: "#777",
            }}
          >
            <div style={{ fontSize: "50px" }}>📦</div>

            <h3>No products yet</h3>

            <p>
              Click "+ Add Product" to add your first
              product.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;