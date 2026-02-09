import boto3
from botocore.config import Config

import settings
from msed.repository.boto3_client_repository import Boto3ClientRepository


class Boto3MSAClientRepositoryImpl(Boto3ClientRepository):
    """Main repository implementation for Boto3MSAClient: Made for generate singleton instance for any BOTO3 MSA AWS resource"""
    _msa_instance = None
    _msa_clients = {}

    def __new__(cls, aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION):
        if cls._msa_instance is None:
            cls._msa_instance = super(Boto3MSAClientRepositoryImpl, cls).__new__(cls)
            cls._msa_instance.config = Config(
                region_name=region_name,
                retries={
                    'max_attempts': 10,
                    'mode': 'standard'
                }
            )
            cls._msa_instance.aws_access_key_id = aws_access_key_id
            cls._msa_instance.aws_secret_access_key = aws_secret_access_key
        return cls._msa_instance

    def get_client(self, service_name):
        if service_name not in self._msa_clients:
            self._msa_clients[service_name] = boto3.client(service_name,
                config=self.config,
                aws_access_key_id=self.aws_access_key_id,
                aws_secret_access_key=self.aws_secret_access_key
            )
        return self._msa_clients[service_name]

    def get_resource(self, resource_name):
        if resource_name not in self._msa_clients:
            self._msa_clients[resource_name] = boto3.resource(resource_name,
                config=self.config,
                aws_access_key_id=self.aws_access_key_id,
                aws_secret_access_key=self.aws_secret_access_key
            )
        return self._msa_clients[resource_name]


    @property
    def instance(self):
        return self._msa_instance



