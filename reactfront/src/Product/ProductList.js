import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../Store/cartSlice";
import axios from 'axios';
import AddWishlistModal from "../Cliente/WishList/WishListAdd";
import { useSelector } from "react-redux";

const PRODUCT_URI = "http://localhost:8000/product/";
const WISH_URI = "http://localhost:8000/wish/";
export const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const email = useSelector((state) => state.auth.correo);

  const getProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_URI);
      setProducts(res.data);
      setError('');
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setError('Error al cargar los productos');
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  const onAddProduct = (product) => {
    dispatch(addProduct(product));
  };

  const onAddProductToWishlist = async (product) => {
    try {
      const data = {
        EmailUser: email,
        ProductID: product
      };
      console.log(data);
      await axios.post(WISH_URI, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setError('');
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al agregar a la wishlist:", error);
      setError('Error al agregar a la wishlist');
    }
  };
  

  return (
    <div className="container-items">
      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}
      {products.map((product) => (
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
            <button onClick={() => onAddProduct(product)}>
              Añadir al carrito
            </button>
            <button onClick={() => onAddProductToWishlist(product.Codigo)}>
              Añadir a la lista de deseos
            </button>
          </div>
        </div>
      ))}

      {/* Modal de éxito para añadir a la lista de deseos */}
      <AddWishlistModal
        show={showSuccessModal}
        handleClose={handleCloseSuccessModal}
      />
    </div>
  );
};

export default ProductList;
