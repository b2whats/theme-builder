/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: {
    public: '/',
    src: '/build',
  },
  plugins: [
    '@snowpack/plugin-typescript',
  ],
};
