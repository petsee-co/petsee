import { GenericEvent } from '@contracts/events';
import { DocumentTemplateField } from '@prisma/client';

export class DocumentTemplateFieldCreatedEvent extends GenericEvent<DocumentTemplateField> {}
