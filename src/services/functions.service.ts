
import { Functions, httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

class FunctionsService {
  private functions: Functions;

  constructor(functions: Functions) {
    this.functions = functions;
  }

  async call<T>(functionName: string, data: T): Promise<any> {
    const callable = httpsCallable(this.functions, functionName);
    return await callable(data);
  }
}

export const functionsService = new FunctionsService(functions);
