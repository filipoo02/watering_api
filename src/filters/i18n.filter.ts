import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {I18nContext} from 'nestjs-i18n';

@Catch(HttpException)
export class I18nFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const i18n = I18nContext.current();

    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();

    const {message, error, statusCode} = (exception.getResponse() as { message: string[], error: string, statusCode: number });

    response
        .status(status)
        .send({
          statusCode,
          message: message.map(m => i18n.translate(m)),
          error
        })
  }
}
