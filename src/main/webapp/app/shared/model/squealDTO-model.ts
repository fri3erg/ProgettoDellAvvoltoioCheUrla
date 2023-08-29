import { ISquealCat } from 'app/entities/squeal-cat/squeal-cat.model';
import { ISquealReaction } from 'app/entities/squeal-reaction/squeal-reaction.model';
import { ISquealViews } from 'app/entities/squeal-views/squeal-views.model';
import { ISqueal } from 'app/entities/squeal/squeal.model';

export interface ISquealDTO {
  squeal?: ISqueal;
  category?: ISquealCat;
  reactions?: ISquealReaction;
  views?: ISquealViews;
}
