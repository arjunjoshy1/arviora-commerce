import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SupportService, toApiTicket } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(private readonly support: SupportService) {}

  @Post()
  async create(@CurrentUser() user: User, @Body() dto: CreateTicketDto) {
    const ticket = await this.support.create(user.id, dto);
    return toApiTicket(ticket);
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    const tickets = await this.support.findAllForUser(user.id);
    return tickets.map(toApiTicket);
  }

  // ---- Admin-only routes (must be declared before ":id" so "admin" isn't
  // swallowed as a ticket id) ----

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  async findAllAdmin() {
    const tickets = await this.support.findAllAdmin();
    return tickets.map(toApiTicket);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    const ticket = await this.support.updateStatus(id, dto);
    return toApiTicket(ticket);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    const ticket = await this.support.findOne(user.id, id);
    return toApiTicket(ticket);
  }
}
