import { GenericEvent } from '@contracts/events';
import { SpeciesTranslation } from '@prisma/client';

export class SpeciesTranslationCreatedEvent extends GenericEvent<SpeciesTranslation> {}
