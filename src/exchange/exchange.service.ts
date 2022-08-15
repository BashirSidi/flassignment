import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { AddRateExchangeDto } from './dto/add-rate-exchange.dto';
import { ExchangeDocument } from './exchange.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel('exchange') private readonly exchangeModel: Model<ExchangeDocument>
  ){}

  async create(createExchangeDto: CreateExchangeDto): Promise<CreateExchangeDto> { 
    const newExchange = new this.exchangeModel({
      base: createExchangeDto.base.toLocaleUpperCase(),
      ...createExchangeDto
    });
    await newExchange.save();
    return newExchange;
  }

  async addExchangeRate(baseCurrency: string, addRateExchangeDto: AddRateExchangeDto): Promise<CreateExchangeDto> {
    const base = baseCurrency.toUpperCase();
    let exchangeData = await this.exchangeModel.findOne({ base });
    if (!exchangeData) {
      throw new BadRequestException('Unknown base value');
    }

    let chkIfTargetExist = exchangeData.rates.find(ex => ex.target === addRateExchangeDto.target)

    if (chkIfTargetExist) {
      throw new BadRequestException('rate to corresponding target already');
    }

    exchangeData.rates.push({
      target: addRateExchangeDto.target,
      rate: addRateExchangeDto.rate
    });

    const res = await this.exchangeModel.findOneAndUpdate({ base }, { ...exchangeData }, { new: true })
    
    return res;
  }

  findAll() {
    return `This action returns all exchange`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exchange`;
  }

  update(id: string, addRateExchangeDto: AddRateExchangeDto) {
    return `This action updates a #${id} exchange`;
  }

  remove(id: number) {
    return `This action removes a #${id} exchange`;
  }
}
