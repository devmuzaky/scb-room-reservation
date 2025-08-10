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
      '@semantic-release/git',
      {
        assets: ['libs/ui/package.json', 'libs/ui/CHANGELOG.md'],
        message: 'chore(ui): 🚀 release v${nextRelease.version} [skip ci] \n\n` + `${nextRelease}',
      },
    ],
  ],
};
