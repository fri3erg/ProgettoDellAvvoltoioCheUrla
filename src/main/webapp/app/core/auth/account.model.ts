export class Account {
  constructor(
    public activated: boolean,
    public authorities: string[],
    public email: string,
    public firstName: string | null,

    public lastName: string | null,
    public login: string,
    public img: string | null,
    public img_content_type: string | null,
    public image_url: string | null,
    public _id?: string,
    public lang_key?: string
  ) {}
}
