import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { AddRateExchangeDto } from './dto/add-rate-exchange.dto';
import { ExchangeDocument } from './exchange.model';
import { ConvertExchangeDto } from './dto/convert-exchange.dto';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel('exchange') private readonly exchangeModel: Model<ExchangeDocument>
  ){}

  async create(createExchangeDto: CreateExchangeDto): Promise<any> { 
    const newExchange = new this.exchangeModel({
      base: createExchangeDto.base.toLocaleUpperCase(),
      ...createExchangeDto
    });
    await newExchange.save();
    return newExchange;
  }

  async addExchangeRate(baseCurrency: string, addRateExchangeDto: AddRateExchangeDto): Promise<any> {
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

  
  async convertExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
    convertExchangeDto: ConvertExchangeDto): Promise<any>
  {
    
  const rate = await this.requestExchangeRate(baseCurrency, targetCurrency)
    
  return Number(rate) * Number(convertExchangeDto.amount);

}

  async requestExchangeRate(baseCurrency: string, targetCurrency: string): Promise<any>{
    if (
      typeof (baseCurrency) !== 'string' ||
      typeof (targetCurrency) !== 'string' ||
      baseCurrency.length !== 3 ||
      targetCurrency.length !== 3
    ) {
      throw new BadRequestException('Unknown base currency value');
    }
    const base = baseCurrency;
    let data = await this.exchangeModel.findOne({ base })

    if (!data) {
      throw new BadRequestException('Unknown base currency value');
    }

    let obj = data.rates.find(r => r.target === targetCurrency);

    if (!obj) {
      throw new BadRequestException('Unknown target currency value');
    }
      
      return obj.rate;

    }

}