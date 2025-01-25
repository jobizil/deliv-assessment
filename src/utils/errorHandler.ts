import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const handleError = (error: unknown, defaultMessage: string = 'Sorry, we\'re unable to process your request at the moment. Please try again.') => {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          if (error.meta?.target && Array.isArray(error.meta.target)) {
            const field = error.meta.target[0];
            return new Error(`A record with this ${field} already exists.`);
          } else {
            return new Error('A database error occurred.');
          }
        case 'P2025':
          return new Error('The specified record could not be found.');
        default:
          return new Error('A database error occurred.');
      }
    }
    return new Error(defaultMessage);
  };
