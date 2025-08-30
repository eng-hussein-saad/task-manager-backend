import { prisma } from '../config/db';
import { User } from '../types';

export const UserModel = {
  async create(data: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user = await prisma.user.create({ data });
    return user as unknown as User;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return (user as unknown as User) || null;
  },

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { user_id: id } });
    return (user as unknown as User) || null;
  },

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      select: { user_id: true, first_name: true, last_name: true, email: true, created_at: true, updated_at: true },
      orderBy: { user_id: 'desc' }
    });
    return users as unknown as User[];
  },
};
