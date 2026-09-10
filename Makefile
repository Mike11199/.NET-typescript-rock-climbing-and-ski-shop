.DEFAULT_GOAL := help

ifeq ($(OS),Windows_NT)
NPM := npm.cmd
else
NPM := npm
endif

.PHONY: help install dev frontend api build test test-frontend test-cdk

define HELP

ski shop commands

  development
    make install         install dependencies from the lockfiles
    make dev             start frontend + api with hot reload
    make frontend        start only the frontend
    make api             start only the api

  build & test
    make build           build frontend + api
    make test            run all regression tests
    make test-frontend   run frontend tests
    make test-cdk        run cdk tests (requires uv)
    make help            show this help

  quick start: make install, then make dev
  ctrl+c stops the development servers.

endef

help:
	@$(info $(HELP))$(if $(filter Windows_NT,$(OS)),cmd /c exit 0,true)

# npm uses concurrently to run both servers in this terminal.
# Uses the existing .NET development profile and configured user secrets.
dev:
	$(NPM) run dev

frontend:
	$(NPM) --prefix frontend start

api:
	$(NPM) run server-dev

install:
	$(NPM) ci
	$(NPM) --prefix frontend ci --legacy-peer-deps
	dotnet restore backend_v2_dotnet

build:
	$(NPM) --prefix frontend run build
	dotnet build backend_v2_dotnet --configuration Release

test: test-frontend test-cdk

test-frontend:
	$(NPM) test

test-cdk:
	uv --directory cdk run --frozen --group dev pytest -q
