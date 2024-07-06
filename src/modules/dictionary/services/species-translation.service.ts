import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { SpeciesTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class SpeciesTranslationService {
  private readonly logger = new Logger(SpeciesTranslationService.name);

  static generateCacheLocale(speciesId: string, locale: string) {
    return `Species-${speciesId}/SpeciesTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<SpeciesTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    speciesId: string,
    locale: string,
  ): Promise<SpeciesTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      SpeciesTranslationService.generateCacheLocale(speciesId, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.speciesTranslation.findUnique({
      where: {
        speciesId_locale: {
          locale,
          speciesId,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(SpeciesTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        SpeciesTranslationService.generateCacheLocale(speciesId, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.SpeciesTranslationWhereInput = {},
  ): Promise<PageDto<SpeciesTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.speciesTranslation.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          name: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
      this.prisma.speciesTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(SpeciesTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}
