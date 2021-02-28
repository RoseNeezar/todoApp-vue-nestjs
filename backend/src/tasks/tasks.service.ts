import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './repository/task.repository';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepository: TaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    return await this.taskRepository.createTask(createTaskDto, user);
  }
}
