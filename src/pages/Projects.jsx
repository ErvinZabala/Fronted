import { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [editingProject, setEditingProject] = useState(null); // Proyecto en edición

  // Obtener los proyectos al cargar la página
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/proyectos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProyectos(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  // Crear un nuevo proyecto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingProject) {
        // Actualizar proyecto existente
        const response = await api.put(
          `/proyectos/${editingProject._id}`,
          { nombre, descripcion },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProyectos(
          proyectos.map((proyecto) =>
            proyecto._id === editingProject._id ? response.data : proyecto
          )
        );
        setMensaje('Proyecto actualizado con éxito.');
        setEditingProject(null);
      } else {
        // Crear un nuevo proyecto
        const response = await api.post(
          '/proyectos',
          { nombre, descripcion },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProyectos([...proyectos, response.data]);
        setMensaje('Proyecto creado con éxito.');
      }
      setNombre('');
      setDescripcion('');
    } catch (err) {
      console.error(err);
      setMensaje('Error al crear o actualizar el proyecto.');
    }
  };

  // Eliminar un proyecto
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/proyectos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProyectos(proyectos.filter((proyecto) => proyecto._id !== id));
      setMensaje('Proyecto eliminado con éxito.');
    } catch (err) {
      console.error(err);
      setMensaje('Error al eliminar el proyecto.');
    }
  };

  // Establecer proyecto en edición
  const handleEdit = (project) => {
    setEditingProject(project);
    setNombre(project.nombre);
    setDescripcion(project.descripcion);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingProject(null);
    setNombre('');
    setDescripcion('');
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Gestión de Proyectos</h1>
      {mensaje && (
        <p
          style={{
            color: mensaje.includes('éxito') ? 'green' : 'red',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          {mensaje}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <label htmlFor="nombre" style={{ fontWeight: 'bold' }}>
          Título:
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Nombre del Proyecto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <label htmlFor="descripcion" style={{ fontWeight: 'bold' }}>
          Descripción:
        </label>
        <textarea
          id="descripcion"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="3"
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'none',
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: editingProject ? '#007BFF' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {editingProject ? 'Actualizar Proyecto' : 'Crear'}
        </button>
        {editingProject && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              padding: '10px',
              backgroundColor: 'gray',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Cancelar Edición
          </button>
        )}
      </form>
      <div>
        {proyectos.map((proyecto, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Título:</p>
            <Link
              to={`/projects/${proyecto._id}`}
              style={{
                textDecoration: 'none',
                color: '#007BFF',
                fontWeight: 'bold',
              }}
            >
              {proyecto.nombre}
            </Link>
            <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Descripción:</p>
            <p style={{ margin: 0, color: '#555' }}>{proyecto.descripcion}</p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '10px',
              }}
            >
              <button
                onClick={() => handleEdit(proyecto)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(proyecto._id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
