from typing import Any, Union

from botocore.client import BaseClient
from botocore.config import Config


class Session:
    def client(
        self,
        service_name: str,
        region_name: str = None,
        api_version: str = None,
        use_ssl: bool = None,
        verify: Union[str, bool] = None,
        endpoint_url: str = None,
        aws_access_key_id: str = None,
        aws_secret_access_key: str = None,
        aws_session_token: str = None,
        config: Config = None,
    ) -> BaseClient:
        pass

    def resource(
        self,
        service_name: str,
        region_name: str = None,
        api_version: str = None,
        use_ssl: bool = None,
        verify: Union[str, bool] = None,
        endpoint_url: str = None,
        aws_access_key_id: str = None,
        aws_secret_access_key: str = None,
        aws_session_token: str = None,
        config: Config = None,
    ) -> Any:
        pass
