from .models import User
from django.db.utils import IntegrityError
import re
import account.exceptions as exception


def saveUser(username, email, password):
    try:
        user = User(username=username, email=email, password=password)
        user.save()
        return user
    except IntegrityError:
        return None


def isValid(username, email, password):
    if (len(username) < 3 or len(username) > 254):
        return {'error': False, 'message': "username > 3 and < 254 characters"}

    pattern = '^\w{3,}@[a-z]{3,}(\.[a-z]{2,}){1,3}$'
    if (not re.match(pattern, email)):
        return {'error': False, 'message': "email is invalid"}

    if (len(password) < 6):
        return {'error': False, 'message': "password > 6 characters"}

    return {'error': True, 'message': ''}


def findUserById(id):
    try:
        return User.objects.filter(id=int(id)).first()
    except TypeError:
        pass


def updateUser(user, username, email, password):
    user.username = username
    user.email = email
    user.password = password
    user.save()
    return user


def delUserById(id):
    try:
        User.objects.filter(id=id).delete()
        return False
    except Exception:
        return True
