export interface IResponse<TItem> {
    $id: string;
    $values: TItem[];
  }
  
  export interface ServerError {
    message: string;
    errors: any;
    errorMessage: string;
  }
  