"""Shared synthesized stacks and deployment workflow."""
from pathlib import Path

import pytest
from aws_cdk import App
from aws_cdk.assertions import Template
import app as cdk_app

ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(scope="session")
def stacks():
    return cdk_app.create_stacks(App())


@pytest.fixture(scope="session")
def template(stacks):
    return Template.from_stack(stacks[1])


@pytest.fixture(scope="session")
def document(template):
    return template.to_json()


@pytest.fixture(scope="session")
def resources(document):
    return document["Resources"]


@pytest.fixture(scope="session")
def repository(stacks):
    return Template.from_stack(stacks[0]).to_json()


@pytest.fixture(scope="session")
def workflow():
    path = ROOT / ".github/workflows/deploy-cdk-aws.yml"
    assert not path.with_suffix(".yml.disabled").exists()
    return path.read_text(encoding="utf-8")
