import pytest
from aws_cdk import App
from aws_cdk.assertions import Template
from app import create_stacks


@pytest.fixture(scope="session")
def stacks():
    return create_stacks(App())


@pytest.fixture(scope="session")
def resources(stacks):
    return Template.from_stack(stacks[1]).to_json()["Resources"]
