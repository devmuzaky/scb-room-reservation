const fs = require('node:fs');
const path = require('node:path');

const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));

/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: 'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    types: [
      { value: 'feat', name: 'feat:     🎉  A new feature', emoji: '🎉' },
      { value: 'fix', name: 'fix:      🐛  A bug fix', emoji: '🐛' },
      { value: 'docs', name: 'docs:     📝  Documentation only changes', emoji: '📝' },
      { value: 'style', name: 'style:    💄  Changes that do not affect the meaning of the code', emoji: '💄' },
      { value: 'refactor', name: 'refactor: 💡  A code change that neither fixes a bug nor adds a feature', emoji: '💡' },
      { value: 'perf', name: 'perf:     ✨  A code change that improves performance', emoji: '✨' },
      { value: 'test', name: 'test:     🧪  Adding missing tests or correcting existing tests', emoji: '🧪' },
      { value: 'build', name: 'build:    📦️   Changes that affect the build system or external dependencies', emoji: '📦️' },
      { value: 'ci', name: 'ci:       👷  Changes to our CI configuration files and scripts', emoji: '👷' },
      { value: 'chore', name: "chore:    🔨  Other changes that don't modify src or test files", emoji: '🔨' },
      { value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: '⏪️' },
    ],
    useEmoji: true,
    emojiAlign: 'center',
    scopes: [...apps],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    upperCaseSubject: false,
    markBreakingChangeMode: true,
    allowBreakingChanges: ['feat', 'fix']
  },
};
