import { ISMMVIP } from 'app/entities/smmvip/smmvip.model';

export interface ISMMUser {
  user_id?: string | null;
  sMM?: Pick<ISMMVIP, 'id'> | null;
}
