import { ApiProperty } from "@nestjs/swagger";

export class ConvertExchangeDto {
  @ApiProperty()
  amount: number
}