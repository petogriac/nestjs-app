import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JobRole, Person, Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async feed() {
    return this.prisma.$transaction([
      this.prisma.person.createMany({
        data: [
          {
            job_role: JobRole.FRONTEND_DEVELOPER,
            first_name: 'Peto',
            last_name: 'G',
            level: 5,
            not_billable: false,
            status: Status.ACTIVE,
          },
          {
            job_role: JobRole.FRONTEND_DEVELOPER,
            first_name: 'Tom',
            last_name: 'J',
            level: 5,
            not_billable: false,
            status: Status.ACTIVE,
          },
        ],
        skipDuplicates: true
      }),

      this.prisma.tag.createMany({
        data: [
          {
            value: 'frontendak',
          },
          {
            value: 'flakac',
          },
        ],
        skipDuplicates: true,
      }),

      this.prisma.tagsOnPersons.createMany({
        data: [
          {
            personId: 1,
            tagId: 1,
          },
          {
            personId: 2,
            tagId: 2,
          },
          {
            personId: 2,
            tagId: 1,
          },
        ],
        skipDuplicates: true,
      }),
    ]);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByTag(tag: string): Promise<Person[]> {
    const persons = this.prisma.person.findMany({
      where: {
        tags: {
          some: {
            tag: {
              value: {
                contains: tag,
                mode: 'insensitive',
              },
            },
          },
        },
      },
    });

    return persons;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
