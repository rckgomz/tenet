[![Open in Remote - Containers](https://img.shields.io/static/v1?label=Remote%20-%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/rckgomz/tenet)

If you already have VS Code and Docker installed, you can click the badge above or [here](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/rckgomz/tenet) to get started. Clicking these links will cause VS Code to automatically install the Remote - Containers extension if needed, clone the source code into a container volume, and spin up a dev container for use.

# Tenet: BE Technical Assignment

I'm using a technology called [dev container](https://code.visualstudio.com/docs/remote/containers) from visual studio code.

if you open this repo, vscode will prompt for open a dev container.

Everything needed for this project is in that docker image and the orquestration is done by docker-compose

## Run the project

```bash
pnpm install
pnpm --filter @tenet/api start:demo
```

## To run the test

```bash
pnpm --filter @tenet/api test
```

### Some stats

```bash
# Test
Test Suites: 10 passed, 10 total
Tests:       36 passed, 36 total

# API
22 endpoints
 3 resources person, product, loan-application

# Database
8 tables
```

## About the project.

For this project I choose a few technologies to showcase best practices and architecture. This is a **mono-repo** intended to host back-end, front-end, infrastructure ([pulumi](https://www.pulumi.com/) and shared components between.

Similar to AngularJS, NestJS support a `mono-repo` mode where they share a lot of things between internal projects.

The layers goes

```bash
    - apps # back-end and front-end apps
        - api # back-end
            - apps # internal NestJS apps/microservices
                - acquisition # this is a microservices
            - libs # internal NestJS lib
        - web # front-end
            - apps
                - NextJS
                - AngularJS
                - Vue
    - packages # shared packages between back and front ends
        - tsconfig
        - core-libs
```

The real meat of this projects is a few files

```bash
- apps/api/apps/acquisition/src/loan-application/services/credit-report.service.ts

- apps/api/apps/acquisition/src/loan-application/services/desicion-making-engine.service.ts

- apps/api/apps/acquisition/src/loan-application/services/loan-application.service.ts

* apps/api/apps/acquisition/src/loan-application/services/loan-application.service.spec.ts

- apps/api/apps/acquisition/src/loan-application/services/loan-offer.service.ts
```

> Note: The endpoint loan application doesn't receive a lot of data like score or APR all that is determine by the back-end. The business logic and uses cases just can be seen and run using tests.

I have also added 2 services intendes to pull the credit-repo data from the user and calculate an ARP based on those input. Again everything needs to be covered by tests and no API calls.

For the PoC I have added 2 leyers of unit-testing. Service layer and Controller just to showcase it.

The main idea is; you have **persons** that want to a apply for a **product** (a loan in a fix term) becoming an **applicant** attach to an **application**. Please refer to the DB diagram to get a better idea.

`apps/api/apps/acquisition/src/loan-application/loan-application.controller.spec.ts`

Tools used to build the PoC

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [TypeORM-Seeding](https://typeorm.io/)
- [PNPM](https://pnpm.io/)
- [Turborepo](https://turborepo.org/)

This API exposes the following endpoints, all endpoints are scoped to `/api/v1/`

```bash
# API server
http://localhost:8080

LoanApplicationController {/api/loan-application} (version: 1)
Mapped {/api/loan-applications, POST} (version: 1) route
Mapped {/api/loan-applications, GET} (version: 1) route
Mapped {/api/loan-applications/:id, GET} (version: 1) route
Mapped {/api/loan-applications/:id, PATCH} (version: 1) route
Mapped {/api/loan-applications/:id, DELETE} (version: 1) route
Mapped {/api/loan-applications/:id/submit, PATCH} (version: 1) route
ProductController {/api/products} (version: 1)
Mapped {/api/products, POST} (version: 1) route
Mapped {/api/products, GET} (version: 1) route
Mapped {/api/products/:id, GET} (version: 1) route
Mapped {/api/products/:id, PATCH} (version: 1) route
Mapped {/api/products/:id, DELETE} (version: 1) route
PersonController {/api/persons} (version: 1)
Mapped {/api/persons, POST} (version: 1) route
Mapped {/api/persons, GET} (version: 1) route
Mapped {/api/persons/:id, GET} (version: 1) route
Mapped {/api/persons/:id, PATCH} (version: 1) route
Mapped {/api/persons/:id, DELETE} (version: 1) route
Mapped {/api/persons/:id/emails, POST} (version: 1) route
Mapped {/api/persons/:id/emails, GET} (version: 1) route
Mapped {/api/persons/:id/emails/:emailId, GET} (version: 1) route
Mapped {/api/persons/:id/phone-numbers, POST} (version: 1) route
Mapped {/api/persons/:id/phone-numbers, GET} (version: 1) route
Mapped {/api/persons/:id/phone-numbers/:phoneNumberId, GET} (version: 1) route

```

### Database Diagaram

![DB Diagram](https://github.com/rckgomz/tenet/blob/main/db-diagram.png)

### Postman Collection Attached

[Postman](https://github.com/rckgomz/tenet/blob/main/acquisition.postman_collection.json)
