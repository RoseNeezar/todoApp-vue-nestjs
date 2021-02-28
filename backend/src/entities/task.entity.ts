import { TaskStatus } from 'src/tasks/enums/task.enum';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task extends BaseEntity {
  constructor(task: Partial<Task>) {
    super();
    Object.assign(this, task);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_) => User, (user) => user.tasks, { eager: false })
  user: User;
}
