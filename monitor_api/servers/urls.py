from django.urls import path, include
from servers.views import ServerViewset, AccessibleServerAPIView
from rest_framework import routers

app_name = "servers"

# router of view set of API view
router = routers.SimpleRouter()

# register of view set of API view
router.register("server", ServerViewset, basename="server")

urlpatterns = [
    # base
    # web socket api
    # api
    path("api/v1/", include(router.urls)),
    path("api/v1/accessible/<int:id>/", AccessibleServerAPIView.as_view(), name="accessible"),
]
