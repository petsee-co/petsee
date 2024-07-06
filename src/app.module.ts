import {
  Module,
  Logger,
  Type,
  ForwardReference,
  DynamicModule,
} from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
// Modules
import { AnimalModule } from '@modules/animal';
import { AuthModule } from '@modules/auth';
import { CoreModule } from '@modules/core';
import { CustomFieldModule } from '@modules/custom-field';
import { CustomerModule } from '@modules/customer';
import { DataLakeModule } from '@modules/data-lake';
import { DictionaryModule } from '@modules/dictionary';
import { FileModule } from '@modules/file';
import { InventoryModule } from '@modules/inventory';
import { HealthModule } from '@modules/health';
import { NoteModule } from '@modules/note';
import { OrganizationModule } from '@modules/organization';
import { ProjectModule } from '@modules/project';
import { SearchModule } from '@modules/search';
import { ServiceModule } from '@modules/service';
import { TagModule } from '@modules/tag';

const modules: Array<
  Type | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  AnimalModule,
  AuthModule,
  CoreModule,
  CustomFieldModule,
  CustomerModule,
  DataLakeModule,
  DictionaryModule,
  FileModule,
  InventoryModule,
  HealthModule,
  NoteModule,
  OrganizationModule,
  ProjectModule,
  ServiceModule,
  TagModule,
  ConditionalModule.registerWhen(
    SearchModule,
    (env: NodeJS.ProcessEnv) => !!env['SEARCH_PROVIDER'],
  ),
];

const controllers: any[] = [];

const providers: any[] = [];

@Module({
  imports: modules,
  controllers,
  providers,
})
export class AppModule {
  constructor() {
    Logger.log(`BOOTSTRAPPED NEST APPLICATION`);
  }
}
