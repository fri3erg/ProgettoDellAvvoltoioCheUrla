export interface Deserializable {
  deserialize(input: any): this;
}

export class Parameter {
  name?: string;
  value?: string;
}

export interface PaymentResponse {
  paymentSuccess: boolean;
  facilitySuccess: boolean;
  messageClass: string;
  message: string;
}

export interface PaymentUrlResponse {
  url: string;
  parameters: Parameter[];
}
