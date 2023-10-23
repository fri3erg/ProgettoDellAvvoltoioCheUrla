export class Account {
  constructor(
    public activated: boolean,
    public authorities: string[],
    public email: string,
    public firstName: string | null,

    public lastName: string | null,
    public login: string,
    public img: string | null,
    public imgContentType: string | null,
    public imageUrl: string | null,
    public id?: string,
    public langKey?: string,
    public lang_key?: string
  ) {}
}
