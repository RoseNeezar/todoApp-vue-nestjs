import { NotFoundException } from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-task-filter.dto';
import { TaskStatus } from '../enums/task.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Partial<Task>> {
    const { description, title } = createTaskDto;
    const task: Partial<Task> = {
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    };

    const result = await Task.create(task).save();
    return result;
  }
  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
