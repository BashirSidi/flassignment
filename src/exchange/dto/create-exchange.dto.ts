import { ApiProperty } from "@nestjs/swagger";
import { AddRateExchangeDto } from "./add-rate-exchange.dto";

export class CreateExchangeDto {
  @ApiProperty()
  base: string;
  @ApiProperty({required: false})
  rates: AddRateExchangeDto;
}