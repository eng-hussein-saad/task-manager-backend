import { prisma } from '../config/db';
import { Task } from '../types';

export const TaskModel = {
  async create(data: Omit<Task, 'task_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const task = await prisma.task.create({ data });
    return task as unknown as Task;
  },

  async findById(id: number): Promise<Task | null> {
    const task = await prisma.task.findUnique({ where: { task_id: id } });
    return (task as unknown as Task) || null;
  },

  async findAllByUser(userId: number): Promise<Task[]> {
    const tasks = await prisma.task.findMany({ where: { user_id: userId }, orderBy: { task_id: 'desc' } });
    return tasks as unknown as Task[];
  },

  async findAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany({ orderBy: { task_id: 'desc' } });
    return tasks as unknown as Task[];
  },

  async update(id: number, data: Partial<Omit<Task, 'task_id'>>): Promise<Task | null> {
    try {
      const updated = await prisma.task.update({
        where: { task_id: id },
        data: { task_title: data.task_title, task_description: data.task_description, is_read: data.is_read, user_id: data.user_id ?? undefined }
      });
      return updated as unknown as Task;
    } catch {
      return null;
    }
  },

  async remove(id: number): Promise<boolean> {
    try {
      await prisma.task.delete({ where: { task_id: id } });
      return true;
    } catch {
      return false;
    }
  }
};
