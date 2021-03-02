import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './enums/task.enum';
import { TaskRepository } from './repository/task.repository';
import * as isUuid from 'is-uuid';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task | undefined> {
    if (!isUuid.v4(id)) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    const result = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return result;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    if (!isUuid.v4(id)) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    this.taskRepository.deleteTaskById(id, user);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Partial<Task>> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task | undefined> {
    const task = await this.getTaskById(id, user);
    task!.status = status;
    await task?.save();
    return task;
  }
}
