import { ApiProperty } from '@nestjs/swagger';

// Baseado na entidade User do Prisma
export class UserDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'João', description: 'Primeiro nome' })
  firstName: string;

  @ApiProperty({ example: 'Silva', description: 'Último nome' })
  lastName: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'REGISTERED', description: 'Status do usuário', enum: ['REGISTERED', 'CONFIRMED'] })
  status: string;

  @ApiProperty({ example: '2025-10-23T15:00:00Z', description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-23T15:00:00Z', description: 'Data de atualização' })
  updatedAt: Date;
}

// Baseado na entidade Booking do Prisma
export class BookingDto {
  @ApiProperty({ example: 1, description: 'ID da reserva' })
  id: number;

  @ApiProperty({ example: '2025-11-15T00:00:00Z', description: 'Data de início da reserva' })
  startDate: Date;

  @ApiProperty({ example: '2025-11-20T00:00:00Z', description: 'Data de fim da reserva' })
  endDate: Date;

  @ApiProperty({ example: 750.00, description: 'Preço total da reserva' })
  totalPrice: number;

  @ApiProperty({ type: UserDto, description: 'Informações do usuário que fez a reserva', required: false })
  user?: UserDto;
}

// Baseado na entidade Place do Prisma
export class PlaceDto {
  @ApiProperty({ example: 1, description: 'ID do lugar' })
  id: number;

  @ApiProperty({ example: 'Casa na Praia', description: 'Título do lugar' })
  title: string;

  @ApiProperty({ example: 'Linda casa na praia com vista para o mar', description: 'Descrição do lugar' })
  description: string;

  @ApiProperty({ example: 'https://example.com/casa-praia.jpg', description: 'URL da imagem' })
  imageUrl: string;

  @ApiProperty({ example: 150.00, description: 'Preço por noite' })
  price: number;

  @ApiProperty({ example: '2025-11-01T00:00:00Z', description: 'Data de início da disponibilidade' })
  availableFrom: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59Z', description: 'Data de fim da disponibilidade' })
  availableTo: Date;

  @ApiProperty({ example: 1, description: 'ID do usuário proprietário' })
  userId: number;

  @ApiProperty({ example: '2025-10-23T15:00:00Z', description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-23T15:00:00Z', description: 'Data de atualização' })
  updatedAt: Date;

  @ApiProperty({ type: UserDto, description: 'Informações do proprietário' })
  user?: UserDto;

  @ApiProperty({ type: [BookingDto], description: 'Reservas do lugar', required: false })
  booking?: BookingDto[];
}

// DTOs de resposta padronizados
export class ApiResponseDto<T> {
  @ApiProperty({ example: true, description: 'Indica se a operação foi bem-sucedida' })
  success: boolean;

  @ApiProperty({ example: 'Operação realizada com sucesso', description: 'Mensagem de sucesso' })
  message: string;

  @ApiProperty({ description: 'Dados retornados' })
  data: T;

  @ApiProperty({ example: 1, description: 'Quantidade de itens (para listas)', required: false })
  count?: number;
}

export class PlaceListResponseDto extends ApiResponseDto<PlaceDto[]> {}
export class PlaceSingleResponseDto extends ApiResponseDto<PlaceDto> {}

// DTO para lugares disponíveis com período de busca
export class PlaceAvailableResponseDto extends ApiResponseDto<PlaceDto[]> {
  @ApiProperty({ 
    example: { startDate: '2025-11-15T00:00:00Z', endDate: '2025-11-20T00:00:00Z' },
    description: 'Período de busca' 
  })
  searchPeriod: {
    startDate: string;
    endDate: string;
  };
}

// DTO para erros
export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código de status HTTP' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Tipo do erro' })
  error: string;

  @ApiProperty({ example: 'Dados inválidos', description: 'Mensagem de erro' })
  message: string;
}
