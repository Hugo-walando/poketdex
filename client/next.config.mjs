function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  images: {
    domains: ['placehold.co', 'res.cloudinary.com'],
    unoptimized: true,
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: [{ loader: '@svgr/webpack', options: { icon: true } }],
  //   });

  //   return config;
  // },
});
