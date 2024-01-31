export interface Deserializable {
  deserialize(input: any): this;
}

export class Parameter implements Deserializable {
  name: string;
  value: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class PaymentResponse implements Deserializable {
  paymentSuccess: boolean;
  facilitySuccess: boolean;
  messageClass: string;
  message: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class PaymentUrlRequest implements Deserializable {
  payToDate: string;
  payToValue: number;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export class PaymentUrlResponse implements Deserializable {
  url: string;
  parameters: Parameter[];

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
