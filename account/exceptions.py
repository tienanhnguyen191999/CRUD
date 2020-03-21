class BaseException(Exception):
    def __init__(self, code='', message='', data=[]):
        self.code = code
        self.message = message
        self.data = data


class UsernameLengthException(BaseException):
    pass


class EmailInvalidException(BaseException):
    pass


class PasswordLenthException(BaseException):
    pass
