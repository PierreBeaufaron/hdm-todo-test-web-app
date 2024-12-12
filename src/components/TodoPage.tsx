/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
      await api.delete('/tasks/' + id);
      setTasks(await api.get('/tasks'));
  }

  const handleCreate = async () => {
    await api.post('/tasks/', {name: 'Nouvelle tâche'})
    setTasks(await api.get('/tasks'));
  }

  const handleChange = (id: number, value: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, name: value } : task
      )
    );
  };

  const handleSave = async (id: number) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    await api.patch('/tasks/' + id, {name: taskToUpdate?.name})
  }

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField 
                size="small" 
                value={task.name}
                onChange={(e) => handleChange(task.id, e.target.value)} 
                onBlur={() => {handleSave(task.id)}}
                fullWidth 
                sx={{ maxWidth: 350 }} />
              <Box>
                <IconButton color="success" disabled>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => {handleDelete(task.id)}}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => {handleCreate()}}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
