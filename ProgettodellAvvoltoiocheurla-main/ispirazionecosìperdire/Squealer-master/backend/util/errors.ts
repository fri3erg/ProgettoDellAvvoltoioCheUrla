// classe per gli errori
export class Error {
  message: ErrorDescriptions;
  code: ErrorCodes;
  constructor(message: ErrorDescriptions, code: ErrorCodes) {
    this.message = message;
    this.code = code;
  }
}

// enum per il codice degli errori
export enum ErrorCodes {
  cannot_create = 1,
  non_existent = 2,
  cannot_update = 3,
  no_timers = 4,
  cannot_delete = 5,
  not_supported = 6,
  not_recived = 7,
}

export enum ErrorDescriptions {
  cannot_create = "Cannot create!",
  non_existent = "Nothing found!",
  cannot_update = "Cannot update!",
  no_timers = "No timer found!",
  cannot_delete = "Cannot delete!",
  not_supported = "File format not supported!",
  not_recived = "Nothing has been recived, check post request!",
}
