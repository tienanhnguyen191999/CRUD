from django.utils.deprecation import MiddlewareMixin
import account.exceptions as accException
from django.shortcuts import render, redirect


class HandleExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, req, exception):
        if (isinstance(exception, accException.EmailInvalidException)):
            return render(req, 'account/403.html')
