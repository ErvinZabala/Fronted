import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h1>Bienvenido al Sistema de Gestión</h1>
      <p>Este es el inicio de tu frontend con React y Vite</p>

      {/* Botones para Registro e Inicio de Sesión */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Registrarse
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default Home;
