function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  images: {
    domains: ['ptcgp-wiki.metainnovation.site', 'placehold.co'],
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: [{ loader: '@svgr/webpack', options: { icon: true } }],
  //   });

  //   return config;
  // },
});
