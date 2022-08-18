import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { AddRateExchangeDto } from './dto/add-rate-exchange.dto';
import { ConvertExchangeDto } from './dto/convert-exchange.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequestExchangeDto } from './dto/request-rate.dto';

@ApiTags('exchanges')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createExchange: CreateExchangeDto) {
    const result = await this.exchangeService.create(createExchange);
    return {
      msg: "currency successfully created",
      base: result.base,
      rates: result.rates,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('addrate/:base')
  async addExchangeRate(
    @Param('base') base: string,
    @Body() addRateExchangeDto: AddRateExchangeDto
  ) {
    const result = await this.exchangeService.addExchangeRate(base, addRateExchangeDto);
    return {
      msg: `Rate between ${base.toLocaleUpperCase()} to ${addRateExchangeDto.target.toLocaleUpperCase()}`,
      result: result
    }
  }

  @ApiOkResponse({type: ConvertExchangeDto})
  @UseGuards(JwtAuthGuard)
  @Get('convert/:base/:target')
  async convertExchangeRate(
    @Param('base') base: string,
    @Param('target') target: string,
    @Body() convertExchangeDto: ConvertExchangeDto
  ) {

    const result = await this.exchangeService.convertExchangeRate(
      base.toLocaleUpperCase(),
      target.toLocaleUpperCase(),
      convertExchangeDto
    );

    const d = new Date();
    const dd = d.getDate();
    const mm = d.getMonth();
    const yyyy = d.getFullYear();
    const hh = d.getHours();
    const m =  d.getMinutes();
    const s = d.getSeconds()
    const currTime = `${dd}/${mm}/${yyyy} - ${hh}:${m}:${s}`;

    return {
      msg: `Amount of ${base.toLocaleUpperCase()} to ${target.toLocaleUpperCase()}`,
      amount: result,
      atTime: currTime,
    }
  }

  @ApiOkResponse({type: RequestExchangeDto})
  @UseGuards(JwtAuthGuard)
  @Get('request/:base/:target')
  async requestExchangeRate(
    @Param('base') base: string,
    @Param('target') target: string,
  ) {

    const result = await this.exchangeService.requestExchangeRate(
      base.toLocaleUpperCase(),
      target.toLocaleUpperCase()
    );

    const d = new Date();
    const dd = d.getDate();
    const mm = d.getMonth();
    const yyyy = d.getFullYear();
    const hh = d.getHours();
    const m =  d.getMinutes();
    const s = d.getSeconds()

    const currTime = `${dd}/${mm}/${yyyy} - ${hh}:${m}:${s}`;
    return {
      msg: `Rate of ${base.toLocaleUpperCase()} to ${target.toLocaleUpperCase()}`,
      rate: result,
      atTime: currTime,
    }
  }

}