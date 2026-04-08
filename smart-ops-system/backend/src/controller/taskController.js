import prisma from '../config/prisma.js';

// GET TASKS: Different logic for Admin vs User
export const getTasks = async (req, res) => {
  const { userId, role } = req.user;

  try {
    let tasks;
    if (role === 'ADMIN' || role === 'MANAGER') {
      // Admins see everything + the name of the person assigned
      tasks = await prisma.task.findMany({
        include: { assignedTo: { select: { name: true } } }
      });
    } else {
      // Regular users only see their own tasks
      tasks = await prisma.task.findMany({
        where: { assignedToId: userId }
      });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// CREATE TASK: Admin Only
export const createTask = async (req, res) => {
  const { title, description, assignedToId } = req.body;

  try {
    // Check if assigned user exists
    const userExists = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!userExists) {
      return res.status(400).json({ error: "Assigned user does not exist" });
    }

    const newTask = await prisma.task.create({
      data: { title, description, assignedToId }
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// UPDATE STATUS: Everyone can do this (for their own tasks)
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    });
    res.json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Update failed" });
  }
};

// ... existing getTasks, createTask, updateTaskStatus code ...

// EDIT FULL TASK: Admin/Manager Only
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assignedToId } = req.body;

  try {
    // Optional: Check if assigned user exists if assignedToId is provided
    if (assignedToId) {
      const userExists = await prisma.user.findUnique({ where: { id: assignedToId } });
      if (!userExists) {
        return res.status(400).json({ error: "Assigned user does not exist" });
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, assignedToId }
    });
    
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task details" });
  }
};

// DELETE TASK: Admin/Manager Only
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id }
    });
    res.json({ message: "Task successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};