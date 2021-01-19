module.exports = {
  branches: "master",
  repositoryUrl: "https://github.com/vytch/fangsjs",
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', {
      "npmPublish": true,
      tarballDir: "dist"
    }],
    ['@semantic-release/github', {
      assets:[
        {path: "coverage.zip", label: 'Code coverage'}
      ]
    }]
  ]
}
