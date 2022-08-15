import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { AddRateExchangeDto } from './dto/add-rate-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('create')
  async create(@Body() createExchange: CreateExchangeDto) {
    const result = await this.exchangeService.create(createExchange);
    return {
      msg: "currency successfully created",
      base: result.base,
      rates: result.rates,
    }
  }

  @Put(':base/addrate')
  async addExchangeRate(
    @Param('base') base: string,
    @Body() addRateExchangeDto: AddRateExchangeDto
  ) {
    const result = await this.exchangeService.addExchangeRate(base, addRateExchangeDto);
    return {
      msg: `Exchange rate between ${base} and ${addRateExchangeDto.target} created!`,
      result: result
    }
  }

  @Get()
  findAll() {
    return this.exchangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExchangeDto: AddRateExchangeDto) {
    return this.exchangeService.update(id, updateExchangeDto); 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeService.remove(+id);
  }
}