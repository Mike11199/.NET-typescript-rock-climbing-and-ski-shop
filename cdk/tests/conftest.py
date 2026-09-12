import pytest
from aws_cdk import App
from app import create_stacks


@pytest.fixture(scope="session")
def stacks():
    return create_stacks(App())
