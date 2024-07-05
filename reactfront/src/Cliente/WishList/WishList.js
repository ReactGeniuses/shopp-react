import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DeleteWishlistModal from './WishListDelete';

const PRODUCT_URI = "http://localhost:8000/product/";
const WISH_URI = "http://localhost:8000/wish/";

const Wishlist = () => {
  const email = useSelector((state) => state.auth.correo);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await axios.get(`${WISH_URI}${email}`);
      const productIds = res.data; // Obtener solo los IDs de los productos

      const productPromises = productIds.map((id) =>
        axios.get(`${PRODUCT_URI}${id}`)
      );
      const productResponses = await Promise.all(productPromises);
      const products = productResponses.map((response) => response.data);

      setWishlistProducts(products);
      setError('');
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setError('Error al cargar los productos');
      setWishlistProducts([]);
    }
  }, [email]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleDelete = async (product) => {
    try {
      await axios.delete(`${WISH_URI}item/${product.Codigo}`);
      setWishlistProducts((prev) => prev.filter((p) => p.Codigo !== product.Codigo));
      setShowModal(false);
    } catch (error) {
      console.error("Error al eliminar el producto de la wishlist:", error);
      setError('Error al eliminar el producto de la wishlist');
    }
  };

  const handleShow = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container-items">
      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}
      {wishlistProducts.map((product) => (
        <div className="item" key={product.Codigo}>
          <figure>
            {product.ProductImageBase64 && (
              <img
                src={`data:image/jpeg;base64,${product.ProductImageBase64}`}
                alt={product.ProductName}
              />
            )}
          </figure>
          <div className="info-product">
            <h2>{product.ProductName}</h2>
            <p className="price">${product.Price}</p>
            <p className="Descripcion1">{product.Descripcion1}</p>
            <p className="Descripcion2">{product.Descripcion2}</p>
            <p className="stock">Stock: {product.Quantity}</p>
            <button onClick={() => handleShow(product)}>
              Eliminar de la lista de deseos
            </button>
          </div>
        </div>
      ))}

      {productToDelete && (
        <DeleteWishlistModal
          show={showModal}
          handleClose={handleClose}
          handleDelete={() => handleDelete(productToDelete)}
          product={productToDelete}
        />
      )}
    </div>
  );
};

export default Wishlist;
