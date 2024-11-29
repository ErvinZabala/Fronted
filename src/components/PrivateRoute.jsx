import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types'; // Importamos PropTypes

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Si el usuario está autenticado, mostramos el contenido
  return user?.loggedIn ? children : <Navigate to="/login" />;
};

// Validación de PropTypes para `children`
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
