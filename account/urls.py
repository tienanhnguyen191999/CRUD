from django.urls import path
from . import views
urlpatterns = [
    path('', views.showIndex, name="account-index"),
    path('create', views.handleCreate, name="account-create"),
    path('getUser', views.getUserById, name="account-getuser"),
    path('updateUser', views.updateUser, name="account-updateuser"),
    path('delUser', views.delUser, name="account-delUser"),
]
