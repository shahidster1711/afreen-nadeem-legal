
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
  
  async call(functionName: string, data: any): Promise<any> {
    try {
      const callable = httpsCallable(this.functions, functionName);
      return await callable(data);
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
