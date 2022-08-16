import { ApiProperty } from "@nestjs/swagger";

export class AddRateExchangeDto {
  @ApiProperty()
  target: string;
  @ApiProperty()
  rate: number;
}