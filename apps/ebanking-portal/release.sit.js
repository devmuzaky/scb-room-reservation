const name = 'ebanking-portal';
const srcRoot = `apps/${name}`;

module.exports = {
  pkgRoot: `dist/${srcRoot}`,
  tagFormat: 'ebanking-portal-v${version}',
  commitPaths: [`${srcRoot}/*`],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `${srcRoot}/CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'cp apps/ebanking-portal/CHANGELOG.md dist/apps/ebanking-portal && cd apps/ebanking-portal && pnpm version ${nextRelease.version} --no-git-tag-version',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['libs/ui/package.json', 'libs/ui/CHANGELOG.md'],
        message: 'chore(ui): 🚀 release v${nextRelease.version} [skip ci] \n\n` + `${nextRelease}',
      },
    ],
  ],
};
