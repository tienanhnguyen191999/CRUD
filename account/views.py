from django.shortcuts import render
from . import services
from django.http import JsonResponse, HttpResponse
from django.core import serializers
from .models import User
import json

# Create your views here.


def showIndex(req):
    users = User.objects.all()
    return render(req, 'index.html', {'users': users})


def handleCreate(req):
    if req.method == 'POST':
        username = req.POST.get('username')
        password = req.POST.get('password')
        email = req.POST.get('email')
        data = {'error': False}
        check = services.isValid(username, email, password)
        if check['error']:
            user = services.saveUser(username, email, password)
            if not user is None:
                data['error'] = False
                data['users'] = user.__str__()
                data['message'] = "Add user success"
            else:
                # if email already exsit
                data['error'] = True
                data['message'] = f"Email {email} already Exist"
        else:
            # if not valid data
            data['message'] = check['message']
            data['error'] = True
        return JsonResponse(data)


def getUserById(req):
    if req.method == 'POST':
        return JsonResponse({"user": services.findUserById(req.POST.get('id')).__str__()})


def updateUser(req):
    if req.method == 'POST':
        id = req.POST.get('id')
        username = req.POST.get('username')
        password = req.POST.get('password')
        email = req.POST.get('email')
        data = {'error': False}
        check = services.isValid(username, email, password)
        if check['error']:
            # get current user
            user = services.findUserById(id)
            if not user is None:
                # update
                user = services.updateUser(user, username, email, password)
                data['error'] = False
                data['users'] = user.__str__()
                data['message'] = "Update user success"
        else:
            data['message'] = check['message']
            data['error'] = True
        return JsonResponse(data)


def delUser(req):
    if req.method == 'POST':
        id = req.POST.get('id')
        error = services.delUserById(id)
        return JsonResponse({"error": error})
