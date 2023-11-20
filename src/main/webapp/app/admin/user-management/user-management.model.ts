export interface IUser {
  id: string | null;
  login?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  activated?: boolean;
  lang_key?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class User implements IUser {
  constructor(
    public id: string | null,
    public login?: string,
    public first_name?: string | null,
    public last_name?: string | null,
    public email?: string,
    public activated?: boolean,
    public lang_key?: string,
    public authorities?: string[],
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {}
}
