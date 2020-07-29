import axios from 'axios';
import {
  LOGIN,
  LOGOUT,
  LOGIN_FAIL,
  LOADED,
  LOADING,
  GET_PRODUCTS,
  ADD_TO_CART,
  types,
  GET_CART,
  GET_CATEGORIES,
} from './actions';

const login = (username) => ({
  type: LOGIN,
  username,
});
const logout = () => ({
  type: LOGOUT,
});

const loginFail = (message) => ({
  type: LOGIN_FAIL,
  message,
});

export const loading = () => ({
  type: LOADING,
});

export const loaded = () => ({
  type: LOADED,
});

const getProducts = (products) => ({
  type: GET_PRODUCTS,
  products,
});

const getCategories = (categories) => ({
  type: GET_CATEGORIES,
  categories,
});

const addToCart = (cart) => ({
  type: ADD_TO_CART,
  cart,
});

const getCart = (cart) => ({
  type: GET_CART,
  cart,
});

export const loginThunk = (username, password) => (dispatch) => {
  dispatch(loading());
  return axios
    .post('/user/login', { username, password })
    .then((res) => {
      console.log(res.data);
      dispatch(login(username));
      dispatch(loaded());
    })
    .catch(() => {
      dispatch(loginFail('Incorrect username or password'));
      dispatch(loaded());
    });
};
export const whoami = () => (dispatch) => {
  dispatch(loading());
  return axios.get('/user/whoami').then(({ data }) => {
    if (data.loggedIn) {
      dispatch(login(data.username));
    } else {
      dispatch(logout());
    }
    dispatch(loaded());
  });
};

export const logoutThunk = () => (dispatch) => {
  dispatch(loading());
  return axios
    .get('/user/logout')
    .then(() => {
      dispatch(logout());
      dispatch(loaded());
    })
    .catch((e) => {
      dispatch(loaded());
      console.log(e);
    });
};

export const getProductsThunk = () => (dispatch) => {
  dispatch(loading());
  return axios
    .get('/api/products')
    .then(({ data }) => {
      dispatch(getProducts(data));
      dispatch(loaded());
    })
    .catch((e) => {
      console.error(e);
      dispatch(loaded());
      return 'Error fetching products';
    });
};

export const addProductThunk = (obj) => async (dispatch) => axios
  .post('/api/products', {
    price: obj.price,
    name: obj.name,
    description: obj.description,
    categoryId: obj.categoryId,
  })
  .then(() => axios.get('/api/products'))
  .then((res) => {
    dispatch({
      type: types.ADD_PRODUCT,
      payload: res.data.products,
    });
  })
  .catch((e) => {
    console.log(e);
  });

export const getCategoriesThunk = () => (dispatch) => {
  dispatch(loading());
  return axios
    .get('/api/categories')
    .then(({ data }) => {
      dispatch(getCategories(data));
      dispatch(loaded());
    })
    .catch((e) => {
      console.error(e);
      dispatch(loaded());
      return 'Error fetching categories';
    });
};

export const addCategoryThunk = (obj) => async (dispatch) => axios
  .post('/api/category', {
    name: obj.name,
  })
  .then(() => axios.get('/api/category'))
  .then((res) => {
    dispatch({
      type: types.ADD_CATEGORY,
      payload: res.data.categories,
    });
  })
  .catch((e) => {
    console.log(e);
  });

export const addToCartThunk = (productId, quantity) => (dispatch) => {
  dispatch(loading());
  return axios
    .post(`/cart/add/${productId}?quantity=${quantity}`)
    .then(({ data }) => {
      dispatch(addToCart(data));
      dispatch(loaded());
    });
};

export const getCartThunk = () => (dispatch) => {
  dispatch(loading());
  return axios.get('/cart/get').then(({ data }) => {
    dispatch(getCart(data));
    dispatch(loaded());
  });
};
