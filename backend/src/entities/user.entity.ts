import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { compare } from 'bcrypt';
import { Task } from './task.entity';
import { classToPlain, Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column('int', { default: 0 })
  tokenVersion: number;

  @OneToMany((_) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  toJSON() {
    return classToPlain(this);
  }
  async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
