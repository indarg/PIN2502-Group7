from abc import ABC, abstractmethod


class Boto3ClientRepository(ABC):

    @abstractmethod
    def get_client(self, service_name):
        """Get a boto3 client for a given service name."""

    def get_resource(self, resource_name):
        """Get a boto3 client for a given resource name."""

    @abstractmethod
    def instance(self):
        """Return a boto3 client for a given service name."""
