import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ nombre: '', descripcion: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/proyectos');
        setProjects(response.data);
      } catch (error) {
        setMensaje('Error al cargar los proyectos.');
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/proyectos', newProject);
      setProjects([...projects, response.data]); // Añadir el proyecto a la lista
      setNewProject({ nombre: '', descripcion: '' }); // Limpiar formulario
      setMensaje('Proyecto creado con éxito.');
    } catch (error) {
      setMensaje('Hubo un error al crear el proyecto.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/proyectos/${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId)); // Eliminar proyecto de la lista
      setMensaje('Proyecto eliminado con éxito.');
    } catch (error) {
      setMensaje('Hubo un error al eliminar el proyecto.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {mensaje && (
        <p style={{ textAlign: 'center', color: mensaje.includes('éxito') ? 'green' : 'red' }}>
          {mensaje}
        </p>
      )}
      <h1 style={{ textAlign: 'center' }}>Gestión de Proyectos</h1>
      <form onSubmit={handleAddProject} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
          <input
            type="text"
            name="nombre"
            value={newProject.nombre}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
          <textarea
            name="descripcion"
            value={newProject.descripcion}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Crear
        </button>
      </form>

      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li
              key={project._id}
              style={{
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <strong>Título:</strong> {project.nombre}
              <br />
              <strong>Descripción:</strong> {project.descripcion}
              <br />
              <button
                onClick={() => handleDeleteProject(project._id)}
                style={{
                  marginTop: '10px',
                  marginRight: '10px',
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
              {/* Botón añadido para "Añadir Tarea" */}
              <Link to={`/projects/${project._id}`}>
                <button
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Añadir Tarea
                </button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay proyectos creados.</p>
      )}
    </div>
  );
};

export default Projects;
