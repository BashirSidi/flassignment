import { ApiProperty } from "@nestjs/swagger";

export class RequestExchangeDto {
  @ApiProperty()
  rate: number
}