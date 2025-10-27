# GitHub Repository Template

This repository is the template to use for any new project and a reference for the already existing ones. This template comes with: 
- Actions Workflows for automating the build, test, deployment and maintenance steps of the project.
- Guidelines for the collaboration between contributors 

## Initial setup
Delete this section after doing the setup. 
- Setup Sonar (including the badges set below)
- Setup all the GitHub Actions
- Modify or leave-as-is the [pull request template](.github/pull_request_template.md)
- Adapt the .gitignore file
- Fill the "Get Started" section below
- Prepare the project for the contributors:
  - Set a [rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) to block the desired branches, by default you can block main/master and require a review and a pull request, preventing push forces, pushing directly to master and so on.
  - Set the auto-delete branch [feature](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches), so stalled, old, legacy branches are removed after merging the PR, keeping the repository clean


[![node](https://img.shields.io/badge/node-20-iron)](https://nodejs.org/download/release/latest-iron/)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=coverage)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=internxt_project-name&metric=bugs)](https://sonarcloud.io/summary/new_code?id=internxt_project-name)
## Get Started

### Quick setup
Explain any tools required to work with this project (yarn, ubuntu libraries, etc)

### How to install
Explain the instructions to follow in order to install the dependencies

### Starting the app
Explain how to start the app, either locally, in docker, etc

### Testing the app
Explain how to run the tests

### License 
This project is based on GNU License. You can show it in the [License](./LICENSE) file.
