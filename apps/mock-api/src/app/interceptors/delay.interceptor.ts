import { delay } from 'rxjs/operators'; // Import RxJS delay operator
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const delayTime = parseInt(process.env.REQUEST_DELAY || '500', 10);

    return next.handle().pipe(delay(delayTime));
  }
}
