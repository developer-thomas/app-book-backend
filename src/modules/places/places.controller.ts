import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse
} from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { 
  PlaceListResponseDto,
  PlaceSingleResponseDto,
  PlaceAvailableResponseDto,
  ErrorResponseDto
} from './dto/place-response.dto';

@ApiTags('Places - Gerenciamento de Lugares')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: '🏠 Criar um novo lugar',
    description: `
      Cria um novo lugar para aluguel no sistema.
      
      **Validações:**
      - Todos os campos são obrigatórios
      - URL da imagem deve ser válida
      - Preço deve ser maior que zero
      - Data de disponibilidade inicial deve ser anterior à data final
      - Usuário proprietário deve existir no sistema
      
      **Regras de Negócio:**
      - O lugar fica disponível para reservas imediatamente após criação
      - Apenas o proprietário pode gerenciar o lugar
    `,
    operationId: 'createPlace'
  })
  @ApiBody({ 
    type: CreatePlaceDto,
    description: 'Dados completos do lugar a ser criado',
    examples: {
      'casa-praia': {
        summary: 'Casa na Praia',
        description: 'Exemplo de uma casa na praia',
        value: {
          title: 'Casa na Praia com Vista para o Mar',
          description: 'Linda casa na praia com 3 quartos, piscina e vista panorâmica para o oceano. Ideal para famílias.',
          imageUrl: 'https://cdn.pixabay.com/photo/2016/11/21/06/53/beautiful-natural-image-1844362_1280.jpg',
          price: 250.00,
          availableFrom: '2025-11-01T00:00:00Z',
          availableTo: '2025-12-31T23:59:59Z',
          userId: 1,
          location: {
            lat: -23.5505,
            lng: -46.6333,
            address: 'Rua das Flores, 123',
            staticMapImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=13&size=600x400&markers=color:red%7C-23.5505,-46.6333&key=YOUR_API_KEY'
          }
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    type: PlaceSingleResponseDto,
    description: 'Lugar criado com sucesso. Retorna os dados completos do lugar incluindo informações do proprietário.'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro de validação nos dados fornecidos ou usuário não encontrado'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  @ApiOperation({ 
    summary: '📋 Listar todos os lugares',
    description: `
      Retorna uma lista paginada de todos os lugares cadastrados no sistema.
      
      **Ordenação:**
      - Os lugares são ordenados por data de criação (mais recentes primeiro)
      - Inclui informações do proprietário e reservas ativas
      
      **Filtros Disponíveis:**
      - Use \`/places/available\` para buscar apenas lugares disponíveis
      - Use \`/places/user/:userId\` para buscar lugares de um usuário específico
      
      **Informações Incluídas:**
      - Dados completos do lugar
      - Informações do proprietário
      - Lista de reservas ativas
    `,
    operationId: 'getAllPlaces'
  })
  @ApiResponse({ 
    type: PlaceListResponseDto,
    description: 'Lista de lugares retornada com sucesso. Inclui contagem total e dados completos.'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Erro ao processar a requisição'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  findAll() {
    return this.placesService.findAll();
  }

  @Get('available')
  @ApiOperation({ 
    summary: '🔍 Buscar lugares disponíveis',
    description: `
      Busca lugares disponíveis para reserva em um período específico.
      
      **Como Funciona:**
      - Verifica se o lugar está dentro do período de disponibilidade
      - Exclui lugares com reservas conflitantes no período
      - Ordena resultados por preço (menor para maior)
      
      **Validações:**
      - Ambas as datas são obrigatórias
      - Data de início deve ser anterior à data de fim
      - Datas devem estar no formato ISO 8601
      - Período deve ser no futuro
      
      **Exemplo de Uso:**
      \`GET /places/available?startDate=2025-11-15T00:00:00Z&endDate=2025-11-20T00:00:00Z\`
    `,
    operationId: 'getAvailablePlaces'
  })
  @ApiQuery({ 
    name: 'startDate', 
    description: 'Data e hora de início da estadia (formato ISO 8601)',
    example: '2025-11-15T00:00:00Z',
    required: true,
    type: 'string',
    format: 'date-time'
  })
  @ApiQuery({ 
    name: 'endDate', 
    description: 'Data e hora de fim da estadia (formato ISO 8601)',
    example: '2025-11-20T00:00:00Z',
    required: true,
    type: 'string',
    format: 'date-time'
  })
  @ApiResponse({ 
    type: PlaceAvailableResponseDto,
    description: 'Lista de lugares disponíveis no período especificado, ordenados por preço.'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Datas inválidas, período inválido ou parâmetros obrigatórios ausentes'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  findAvailable(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    if (!startDate || !endDate) {
      throw new Error('startDate and endDate are required');
    }
    return this.placesService.findAvailable(startDate, endDate);
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: '👤 Buscar lugares por usuário',
    description: `
      Retorna todos os lugares cadastrados por um usuário específico.
      
      **Funcionalidades:**
      - Lista todos os lugares de propriedade do usuário
      - Inclui informações de reservas ativas
      - Ordenados por data de criação (mais recentes primeiro)
      
      **Casos de Uso:**
      - Dashboard do proprietário
      - Gerenciamento de propriedades
      - Relatórios de performance
      
      **Informações Incluídas:**
      - Dados completos dos lugares
      - Estatísticas de reservas
      - Status de disponibilidade
    `,
    operationId: 'getPlacesByUser'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID único do usuário proprietário',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    type: PlaceListResponseDto,
    description: 'Lista de lugares do usuário retornada com sucesso. Inclui contagem total e dados completos.'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'ID de usuário inválido ou erro ao processar a requisição'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.placesService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: '🔍 Buscar lugar por ID',
    description: `
      Retorna os detalhes completos de um lugar específico pelo seu ID.
      
      **Informações Incluídas:**
      - Dados completos do lugar
      - Informações do proprietário
      - Lista de reservas ativas e históricas
      - Estatísticas de uso
      
      **Casos de Uso:**
      - Visualização detalhada do lugar
      - Página de detalhes para reserva
      - Análise de performance do lugar
      
      **Validações:**
      - ID deve ser um número inteiro válido
      - Lugar deve existir no sistema
    `,
    operationId: 'getPlaceById'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do lugar',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    type: PlaceSingleResponseDto,
    description: 'Detalhes completos do lugar encontrado com sucesso.'
  })
  @ApiNotFoundResponse({ 
    type: ErrorResponseDto,
    description: 'Lugar não encontrado com o ID fornecido'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'ID inválido ou erro ao processar a requisição'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: '✏️ Atualizar lugar',
    description: `
      Atualiza as informações de um lugar existente.
      
      **Campos Atualizáveis:**
      - Título e descrição
      - URL da imagem
      - Preço por noite
      - Período de disponibilidade
      - Usuário proprietário
      
      **Validações:**
      - Lugar deve existir no sistema
      - Usuário proprietário deve existir (se alterado)
      - Datas de disponibilidade devem ser válidas
      - Preço deve ser maior que zero
      - URL da imagem deve ser válida
      
      **Regras de Negócio:**
      - Apenas campos fornecidos são atualizados
      - Alterações em datas afetam reservas futuras
      - Alterações de preço não afetam reservas já confirmadas
    `,
    operationId: 'updatePlace'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do lugar a ser atualizado',
    example: 1,
    type: 'integer'
  })
  @ApiBody({ 
    type: UpdatePlaceDto,
    description: 'Dados do lugar a serem atualizados (apenas campos fornecidos serão atualizados)',
    examples: {
      'atualizar-preco': {
        summary: 'Atualizar Preço',
        description: 'Exemplo de atualização apenas do preço',
        value: {
          price: 200.00
        }
      },
      'atualizar-disponibilidade': {
        summary: 'Atualizar Disponibilidade',
        description: 'Exemplo de atualização do período de disponibilidade',
        value: {
          availableFrom: '2025-12-01T00:00:00Z',
          availableTo: '2026-03-31T23:59:59Z'
        }
      },
      'atualizacao-completa': {
        summary: 'Atualização Completa',
        description: 'Exemplo de atualização de múltiplos campos',
        value: {
          title: 'Casa na Praia - Atualizada',
          description: 'Casa renovada com nova decoração e móveis modernos',
          imageUrl: 'https://cdn.pixabay.com/photo/2016/11/21/06/53/beautiful-natural-image-1844362_1280.jpg',
          price: 280.00,
          availableFrom: '2025-12-01T00:00:00Z',
          availableTo: '2026-03-31T23:59:59Z'
        }
      }
    }
  })
  @ApiResponse({ 
    type: PlaceSingleResponseDto,
    description: 'Lugar atualizado com sucesso. Retorna os dados completos atualizados.'
  })
  @ApiNotFoundResponse({ 
    type: ErrorResponseDto,
    description: 'Lugar não encontrado com o ID fornecido'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Dados inválidos, usuário não encontrado ou erro de validação'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePlaceDto: UpdatePlaceDto
  ) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '🗑️ Deletar lugar',
    description: `
      Remove um lugar do sistema permanentemente.
      
      **Validações:**
      - Lugar deve existir no sistema
      - Não pode ter reservas ativas (futuras)
      - Apenas o proprietário pode deletar
      
      **Regras de Negócio:**
      - Reservas passadas não impedem a exclusão
      - Reservas futuras impedem a exclusão
      - Ação irreversível - dados são removidos permanentemente
      - Reservas canceladas não impedem a exclusão
      
      **Consequências:**
      - Lugar removido de todas as buscas
      - Reservas futuras são canceladas automaticamente
      - Dados históricos são mantidos para relatórios
    `,
    operationId: 'deletePlace'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do lugar a ser deletado',
    example: 1,
    type: 'integer'
  })
  @ApiResponse({ 
    status: 200,
    description: 'Lugar deletado com sucesso. Nenhum conteúdo retornado.',
    content: {
      'application/json': {
        example: null
      }
    }
  })
  @ApiNotFoundResponse({ 
    type: ErrorResponseDto,
    description: 'Lugar não encontrado com o ID fornecido'
  })
  @ApiBadRequestResponse({ 
    type: ErrorResponseDto,
    description: 'Não é possível deletar lugar com reservas ativas futuras'
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    type: ErrorResponseDto
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.placesService.remove(id);
  }
}
