.DEFAULT_GOAL := help

ifeq ($(OS),Windows_NT)
NPM := npm.cmd
else
NPM := npm
endif

.PHONY: help install dev down frontend api build test test-frontend test-cdk

define HELP

ski shop commands

  development
    make install         install dependencies from the lockfiles
    make dev             start frontend + API in Docker with hot reload (http://localhost:5174)
    make down            stop the Docker development stack
    make frontend        start only the frontend container
    make api             start only the API container

  build & test
    make build           build frontend + api
    make test            run all regression tests
    make test-frontend   run frontend tests
    make test-cdk        run cdk tests (requires uv)
    make help            show this help

  quick start: make install, then make dev
  ctrl+c stops the development containers.

endef

help:
	@$(info $(HELP))$(if $(filter Windows_NT,$(OS)),cmd /c exit 0,true)

# Keep development processes inside Docker so they cannot survive as host Vite/.NET processes.
dev:
	docker compose -f docker-compose.dev.yml up --build

down:
	docker compose -f docker-compose.dev.yml down

frontend:
	docker compose -f docker-compose.dev.yml up --build front-end

api:
	docker compose -f docker-compose.dev.yml up --build back-end-v2

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
