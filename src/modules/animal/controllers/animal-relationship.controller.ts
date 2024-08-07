import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  AnimalEntities,
  AnimalRelationshipDto,
  AnimalRelationshipFiltersDto,
  CreateAnimalRelationshipRequest,
  UpdateAnimalRelationshipRequest,
} from '@contracts/animal';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { SearchRequestDto } from '@contracts/core';
import { Ctx, TriggeredBy } from '@shared/decorators';
import { SearchService } from '@modules/core';

import { AnimalRelationshipService } from '../services';

@ApiTags('Animal')
@Controller('animal-relationships')
@UseGuards(AuthGuard('bearer'))
export class AnimalRelationshipController {
  private readonly logger = new Logger(AnimalRelationshipController.name);

  constructor(
    private readonly animalRelationshipService: AnimalRelationshipService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(AnimalRelationshipDto)
  async list(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() filters: AnimalRelationshipFiltersDto,
  ) {
    return this.animalRelationshipService.findAll(context, pageOptionsDto, {
      ...filters,
      projectId: context.projectId,
    });
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(AnimalRelationshipDto)
  async search(
    @Ctx() context: Context,
    @Query() searchRequestDto: SearchRequestDto,
  ) {
    if (!this.searchService) {
      return new NotImplementedException('Search module not set up');
    }
    return this.searchService.search({
      indexName: AnimalEntities.ANIMAL_RELATIONSHIP,
      projectId: context.projectId,
      ...searchRequestDto,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AnimalRelationshipDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.animalRelationshipService.findOneById(context, {
      id,
      projectId: context.projectId,
    });

    if (!entry) {
      throw new NotFoundException('Animal not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AnimalRelationshipDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createAnimalRelationshipDto: CreateAnimalRelationshipRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.animalRelationshipService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createAnimalRelationshipDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: AnimalRelationshipDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateAnimalRelationshipDto: UpdateAnimalRelationshipRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.animalRelationshipService.update(context, {
      id,
      projectId: context.projectId,
      ...updateAnimalRelationshipDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: AnimalRelationshipDto,
  })
  async delete(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.animalRelationshipService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
