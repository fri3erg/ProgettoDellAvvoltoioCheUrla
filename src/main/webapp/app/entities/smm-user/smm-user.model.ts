import { ISMMVIP } from 'app/entities/smmvip/smmvip.model';

export interface ISMMUser {
  userId?: string | null;
  sMM?: Pick<ISMMVIP, 'id'> | null;
}
