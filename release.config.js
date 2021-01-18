module.exports = {
  branches: "master",
  repositoryUrl: "https://github.com/vytch/fangsjs",
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github'
  ]
}
