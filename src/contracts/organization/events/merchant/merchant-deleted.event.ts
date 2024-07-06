import { GenericEvent } from '@contracts/events';
import { Merchant } from '@prisma/client';

export class MerchantDeletedEvent extends GenericEvent<Merchant> {}
