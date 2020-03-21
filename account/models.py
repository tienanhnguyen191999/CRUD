from django.db import models
import json
# Create your models here.


class User(models.Model):
    username = models.TextField()
    email = models.EmailField(max_length=255, unique=True)
    password = models.TextField()

    # return to dictionary type ( Important when using with JsonResponse)
    def __str__(self):
        return json.dumps({
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'password': self.password,
        })
