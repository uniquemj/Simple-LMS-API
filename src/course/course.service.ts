import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>){}

  async create(createCourseDto: CreateCourseDto) {
    return await this.courseModel.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      level: createCourseDto.level,
      price: createCourseDto.price
    });
  }

  async findAll() {
    return await this.courseModel.find({});
  }

  async findOne(id: string) {
    const course = await this.courseModel.findOne({_id: id});
    if(!course){
      throw new NotFoundException('Course Not Found!');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModel.findOne({_id: id});
    if(!course){
      throw new NotFoundException('Course Not Found!');
    }
    return await this.courseModel.findOneAndUpdate({_id: id}, updateCourseDto, {returnDocument: 'after'});
  }

  async remove(id: string) {
    const course = await this.courseModel.findOne({_id: id});
    if(!course){
      throw new NotFoundException('Course Not Found!');
    }
    return await this.courseModel.findOneAndDelete({_id: id});
  }
}
