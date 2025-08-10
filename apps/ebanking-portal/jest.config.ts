export default {
  displayName: 'ebanking-portal',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/ebanking-portal',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@/layout/(.*)$': '<rootDir>/src/app/layout/$1',
    '^@/auth/(.*)$': '<rootDir>/src/app/auth/$1',
    '^@/home/(.*)$': '<rootDir>/src/app/home/$1',
    '^@/models/(.*)$': '<rootDir>/src/app/core/models/$1',
    '^@/services/(.*)$': '<rootDir>/src/app/core/services/$1',
    '^@/utils/(.*)$': '<rootDir>/src/app/core/utils/$1',
    '^@/mocks/(.*)$': '<rootDir>/src/app/core/mocks/$1',
    '^@/config/(.*)$': '<rootDir>/src/app/core/config/$1',
    '^@/store/(.*)$': '<rootDir>/src/app/core/store/$1',
    '^@/(.*)$': '<rootDir>/src/app/$1',
  },
};
