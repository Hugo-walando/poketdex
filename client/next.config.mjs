function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: false,
  images: {
    domains: ['ptcgp-wiki.metainnovation.site'],
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: [{ loader: '@svgr/webpack', options: { icon: true } }],
  //   });

  //   return config;
  // },
});
