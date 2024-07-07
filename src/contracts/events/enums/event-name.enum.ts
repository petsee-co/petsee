import { AnimalEvents } from '@contracts/animal';
import { CommunicationEvents } from '@contracts/communication';
import { CustomerEvents } from '@contracts/customer';
import { CustomFieldEvents } from '@contracts/custom-field';
import { DictionaryEvents } from '@contracts/dictionary';
import { FileEvents } from '@contracts/file';
import { InventoryEvents } from '@contracts/inventory';
import { NoteEvents } from '@contracts/note';
import { OrganizationEvents } from '@contracts/organization';
import { ProjectEvents } from '@contracts/project';
import { TaskEvents } from '@contracts/task';
import { TagEvents } from '@contracts/tag';
import { ServiceEvents } from '@contracts/service';

export type EventNames =
  | AnimalEvents
  | CommunicationEvents
  | CustomerEvents
  | CustomFieldEvents
  | DictionaryEvents
  | FileEvents
  | InventoryEvents
  | NoteEvents
  | OrganizationEvents
  | ProjectEvents
  | TaskEvents
  | TagEvents
  | ServiceEvents;
