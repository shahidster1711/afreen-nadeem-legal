
import { 
  Functions, 
  httpsCallable, 
} from 'firebase/functions';
import { functions } from '../firebase';

class FunctionsService {
  private functions: Functions;

  constructor(functions: Functions) {
    this.functions = functions;
  }
  
  async call<TData = Record<string, unknown>, TResult = unknown>(functionName: string, data: TData): Promise<TResult> {
    try {
      const callable = httpsCallable<TData, TResult>(this.functions, functionName);
      const result = await callable(data);
      return result.data;
    } catch (error) {
      console.error(`Error calling function ${functionName}:`, error);
      throw error;
    }
  }

  async sendStatusUpdateEmail(submissionId: string, clientName: string, clientEmail: string, newStatus: string, previousStatus: string): Promise<any> {
    return this.call('sendStatusUpdateEmail', { 
      submissionId, 
      clientName, 
      clientEmail, 
      newStatus, 
      previousStatus 
    });
  }
}

export const functionsService = new FunctionsService(functions);
