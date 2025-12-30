import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { 
  BookingListResponseDto,
  BookingSingleResponseDto,
  ErrorResponseDto
} from './dto/booking-response.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Criar uma nova reserva',
    description: 'Cria uma nova reserva para um lugar específico'
  })
  @ApiBody({ 
    type: CreateBookingDto,
    description: 'Dados da reserva a ser criada'
  })
  @ApiCreatedResponse({ 
    type: BookingSingleResponseDto,
    description: 'Reserva criada com sucesso'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Dados inválidos, lugar não disponível ou usuário não encontrado'
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas as reservas',
    description: 'Retorna uma lista de todas as reservas cadastradas no sistema'
  })
  @ApiResponse({ 
    type: BookingListResponseDto,
    description: 'Lista de reservas retornada com sucesso'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro ao buscar reservas'
  })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Buscar reservas por usuário',
    description: 'Retorna todas as reservas feitas por um usuário específico'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID do usuário',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    type: BookingListResponseDto,
    description: 'Reservas do usuário retornadas com sucesso'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro ao buscar reservas do usuário'
  })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.bookingsService.findByUserId(userId);
  }

  @Get('place/:placeId')
  @ApiOperation({ 
    summary: 'Buscar reservas por lugar',
    description: 'Retorna todas as reservas de um lugar específico'
  })
  @ApiParam({ 
    name: 'placeId', 
    description: 'ID do lugar',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    type: BookingListResponseDto,
    description: 'Reservas do lugar retornadas com sucesso'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro ao buscar reservas do lugar'
  })
  findByPlaceId(@Param('placeId', ParseIntPipe) placeId: number) {
    return this.bookingsService.findByPlaceId(placeId);
  }

  @Get('place/:placeId/active')
  @ApiOperation({ 
    summary: 'Buscar reservas ativas por lugar',
    description: 'Retorna todas as reservas ativas (futuras) de um lugar específico'
  })
  @ApiParam({ 
    name: 'placeId', 
    description: 'ID do lugar',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    type: BookingListResponseDto,
    description: 'Reservas ativas do lugar retornadas com sucesso'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro ao buscar reservas ativas do lugar'
  })
  findActiveByPlaceId(@Param('placeId', ParseIntPipe) placeId: number) {
    return this.bookingsService.findActiveByPlaceId(placeId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar reserva por ID',
    description: 'Retorna os detalhes de uma reserva específica pelo seu ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da reserva',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    type: BookingSingleResponseDto,
    description: 'Reserva encontrada com sucesso'
  })
  @ApiNotFoundResponse({ 
    type: ErrorResponseDto,
    description: 'Reserva não encontrada'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro ao buscar reserva'
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar reserva',
    description: 'Atualiza as informações de uma reserva existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da reserva a ser atualizada',
    example: 1,
    type: 'integer'
  })
  @ApiBody({ 
    type: UpdateBookingDto,
    description: 'Dados da reserva a serem atualizados'
  })
  @ApiResponse({ 
    type: BookingSingleResponseDto,
    description: 'Reserva atualizada com sucesso'
  })
  @ApiNotFoundResponse({ 
    type: ErrorResponseDto,
    description: 'Reserva não encontrada'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Dados inválidos ou lugar não disponível'
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Deletar reserva',
    description: 'Remove uma reserva do sistema. Não é possível deletar reservas que já começaram.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da reserva a ser deletada',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 204,
    description: 'Reserva deletada com sucesso'
  })
  @ApiNotFoundResponse({ 
    type: ErrorResponseDto,
    description: 'Reserva não encontrada'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Não é possível deletar reserva que já começou'
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
