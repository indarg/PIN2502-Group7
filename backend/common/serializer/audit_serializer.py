"""Request object to create an analysis contract"""
from rest_framework import serializers



class AuditSerializer(serializers.Serializer):
    #createdBy = UserTOSerializer(required=False, allow_null=True)
    createdAt = serializers.DateTimeField(required=False, allow_null=True)
    #updatedBy = UserTOSerializer(required=False, allow_null=True)
    updatedAt = serializers.DateTimeField(required=False, allow_null=True)