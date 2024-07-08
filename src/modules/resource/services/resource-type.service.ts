import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, ResourceType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateResourceTypeDto,
  UpdateResourceTypeDto,
  DeleteResourceTypeDto,
  ResourceTypeCreatedEvent,
  ResourceTypeUpdatedEvent,
  ResourceTypeDeletedEvent,
  ResourceEvents,
  ResourceTypeDto,
  ResourceEntities,
} from '@contracts/resource';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class ResourceTypeService {
  private readonly logger = new Logger(ResourceTypeService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/ResourceType-${id}/ID`;
  }

  static generateEntityId(entry: ResourceType) {
    return `Project-${entry.projectId}/ResourceType-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ResourceTypeDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ResourceTypeDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ResourceTypeDto | null> {
    const cachedData = await this.cacheService.get(
      ResourceTypeService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ResourceTypeDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.resourceType.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ResourceTypeDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        ResourceTypeService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ResourceTypeWhereInput = {},
  ): Promise<PageDto<ResourceTypeDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.resourceType.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
      this.prisma.resourceType.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ResourceTypeDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateResourceTypeDto,
  ): Promise<ResourceTypeDto> {
    const entry = await this.prisma.resourceType.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ResourceTypeDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      ResourceTypeService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ResourceEntities.RESOURCE_TYPE,
      entityId: ResourceTypeService.generateEntityId(entry),
      eventName: ResourceEvents.RESOURCE_TYPE_CREATED,
      event: new ResourceTypeCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateResourceTypeDto,
  ): Promise<ResourceTypeDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.resourceType.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(
      ResourceTypeDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ResourceTypeService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ResourceEntities.RESOURCE_TYPE,
      entityId: ResourceTypeService.generateEntityId(updatedEntry),
      eventName: ResourceEvents.RESOURCE_TYPE_UPDATED,
      event: new ResourceTypeUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteResourceTypeDto,
  ): Promise<ResourceTypeDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.resourceType.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(
      ResourceTypeDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ResourceTypeService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: ResourceEntities.RESOURCE_TYPE,
      entityId: ResourceTypeService.generateEntityId(updatedEntry),
      eventName: ResourceEvents.RESOURCE_TYPE_DELETED,
      event: new ResourceTypeDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}