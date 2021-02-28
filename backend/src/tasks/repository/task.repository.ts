import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
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
}
