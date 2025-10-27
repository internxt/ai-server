# When a Pull Request is Ready for Review

## Actions

### `build-project.yml`

- Ensures the project build is done correctly. Otherwise merging it would be dangerous. 

### `run-tests.yml`

- Runs the unit, integration and end-to-end tests of the project. Otherwise merging it would be dangerous.

### `sonar-analysis.yml`

- Runs Sonar against the changes proposed on the Pull Requests, **this is the biggest deal of the repository**, as it is the main maintenance tool. 
- Requires the following variables: 
  - `GITHUB_TOKEN`: The action creates this variable itself.
  - `SONAR_TOKEN`: [A Sonar Cloud account token](https://docs.sonarsource.com/sonarqube/latest/user-guide/managing-tokens/) 

> NOTE: You need to take care of the tool used for testing, as it should generate the expected coverage file output expected by Sonar, otherwise that part will not work. (p.e: [with JavaScript/TypeScript, we can use Jest](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/test-coverage/javascript-typescript-test-coverage/))