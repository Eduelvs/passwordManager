import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({ example: 'GitHub' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'meuusuario' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Senha guardada para o site/serviço',
    example: 'xK9#mP2',
  })
  @IsString()
  @IsNotEmpty()
  secret: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
