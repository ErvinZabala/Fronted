import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams(); // ID del proyecto
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'pendiente',
  });
  const [editingTask, setEditingTask] = useState(null); // Estado para tarea en edición
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/proyectos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setMensaje('Error al cargar el proyecto.');
      }
    };

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/proyectos/${id}/tareas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setMensaje('Error al cargar las tareas.');
      }
    };

    fetchProject();
    fetchTasks();
  }, [id]);

  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/proyectos/${id}/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks([...tasks, data]); // Agregar tarea a la lista
        setNewTask({ titulo: '', descripcion: '', prioridad: 'media', estado: 'pendiente' }); // Resetear el formulario
        setMensaje('Tarea creada con éxito.');
      } else {
        setMensaje(data.msg || 'Error al crear la tarea.');
      }
    } catch (error) {
      setMensaje('Hubo un error al crear la tarea.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/proyectos/${id}/tareas/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId)); // Eliminar tarea de la lista
        setMensaje('Tarea eliminada con éxito.');
      } else {
        setMensaje('Error al eliminar la tarea.');
      }
    } catch (error) {
      setMensaje('Hubo un error al eliminar la tarea.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task); // Establecer tarea en edición
    setNewTask({
      titulo: task.titulo,
      descripcion: task.descripcion,
      prioridad: task.prioridad,
      estado: task.estado,
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/proyectos/${id}/tareas/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(
          tasks.map((task) => (task._id === editingTask._id ? data : task)) // Actualizar tarea en la lista
        );
        setEditingTask(null); // Limpiar edición
        setNewTask({ titulo: '', descripcion: '', prioridad: 'media', estado: 'pendiente' });
        setMensaje('Tarea actualizada con éxito.');
      } else {
        setMensaje('Error al actualizar la tarea.');
      }
    } catch (error) {
      setMensaje('Hubo un error al actualizar la tarea.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTask({ titulo: '', descripcion: '', prioridad: 'media', estado: 'pendiente' });
    setMensaje('Edición cancelada.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {mensaje && (
        <p style={{ textAlign: 'center', color: mensaje.includes('éxito') ? 'green' : 'red' }}>
          {mensaje}
        </p>
      )}
      {project ? (
        <>
          <h1 style={{ textAlign: 'center' }}>{project.nombre}</h1>
          <p style={{ textAlign: 'center', color: '#555' }}>{project.descripcion}</p>

          {/* Formulario para agregar o editar tareas */}
          <h2 style={{ marginTop: '30px' }}>{editingTask ? 'Editar Tarea' : 'Crear Tarea'}</h2>
          <form onSubmit={editingTask ? handleUpdateTask : handleAddTask}>
            <input
              type="text"
              name="titulo"
              placeholder="Título de la tarea"
              value={newTask.titulo}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={newTask.descripcion}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <select
              name="prioridad"
              value={newTask.prioridad}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <select
              name="estado"
              value={newTask.estado}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: editingTask ? '#007bff' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {editingTask ? 'Actualizar Tarea' : 'Crear Tarea'}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancelar Actualización
              </button>
            )}
          </form>

          {/* Lista de tareas */}
          <h2 style={{ marginTop: '20px' }}>Tareas</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task._id}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <strong>{task.titulo}</strong>: {task.descripcion || 'Sin descripción'} (
                  {task.prioridad}) - Estado: {task.estado}
                  <br />
                  <button
                    onClick={() => handleEditTask(task)}
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    style={{
                      marginTop: '10px',
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
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay tareas creadas en este proyecto.</p>
          )}
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Error: Proyecto no encontrado.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
