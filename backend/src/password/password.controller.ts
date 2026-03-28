import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/decorators/current-user.decorator';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PasswordService } from './password.service';

@ApiTags('passwords')
@ApiCookieAuth('token')
@UseGuards(JwtAuthGuard)
@Controller('passwords')
export class PasswordController {
  constructor(private readonly passwords: PasswordService) {}

  @Post()
  @ApiOperation({ summary: 'Criar registro de senha' })
  create(@CurrentUser() user: JwtUser, @Body() dto: CreatePasswordDto) {
    return this.passwords.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar senhas do usuário' })
  list(@CurrentUser() user: JwtUser) {
    return this.passwords.list(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Visualizar um registro' })
  getOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.passwords.getOne(user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar registro' })
  update(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.passwords.update(user.sub, id, dto);
  }
}
