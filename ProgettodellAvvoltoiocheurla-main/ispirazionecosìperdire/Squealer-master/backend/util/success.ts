// classe per i successi
export class Success {
  message: SuccessDescription;
  code: SuccessCode;
  constructor(message: SuccessDescription, code: SuccessCode) {
    this.message = message;
    this.code = code;
  }
}
// enum per il codice dei successi
export enum SuccessCode {
  created = 0,
  updated = 1,
  removed = 2,
  logged_in = 3,
  logged_out = 4,
}

// enum per le descrizioni dei successi
export enum SuccessDescription {
  created = "Successfully created",
  updated = "Updated successfully",
  removed = "Removed successfully",
  logged_in = "Logged in successfully",
  logged_out = "Logged out successfully",
}
